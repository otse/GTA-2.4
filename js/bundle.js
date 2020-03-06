var gta_kill = (function (exports, THREE) {
    'use strict';

    var THREE__default = 'default' in THREE ? THREE['default'] : THREE;

    var Points;
    (function (Points) {
        /*export interface Point {
            x: number;
            y: number;
        }*/
        function make(x, y) {
            return { x: x, y: y };
        }
        Points.make = make;
        function copy(a) {
            return { x: a.x, y: a.y };
        }
        Points.copy = copy;
        function floor(a) {
            return make(Math.floor(a.x), Math.floor(a.y));
        }
        Points.floor = floor;
        function floor2(x, y) {
            return make(Math.floor(x), Math.floor(y));
        }
        Points.floor2 = floor2;
        function different(a, b) {
            return a.x - b.x || a.y - b.y;
        }
        Points.different = different;
        function same(a, b) {
            return !different(a, b);
        }
        Points.same = same;
        function multp(a, n) {
            let b = copy(a);
            return make(b.x * n, b.y * n);
        }
        Points.multp = multp;
        function region(a, n) {
            return floor2(a.x / n, a.y / n);
        }
        Points.region = region;
    })(Points || (Points = {}));
    var Points$1 = Points;

    var Chunks;
    (function (Chunks) {
        Chunks.tileSpan = 7;
        let geometry;
        let blue;
        let purple;
        const N = 64 * Chunks.tileSpan;
        function Init() {
            geometry = new THREE.BoxGeometry(N, N, 0);
            blue = new THREE.MeshBasicMaterial({ wireframe: true, color: 'blue' });
            purple = new THREE.MeshBasicMaterial({ wireframe: true, color: 'purple' });
        }
        Chunks.Init = Init;
        function Scaffold(chunk) {
            chunk.wireframe = new THREE.Mesh(geometry, purple);
            chunk.wireframe.position.set(((chunk.w.x + 1) * N) - N / 2, ((chunk.w.y + 1) * N) - N / 2, 0);
            chunk.group.add(chunk.wireframe);
        }
        Chunks.Scaffold = Scaffold;
        // This is the visibility test
        function Vis(chunk, p) {
            const m = Math.ceil(City.spanUneven / 2);
            const d = Points$1.make(Math.abs(p.x - chunk.w.x), Math.abs(p.y - chunk.w.y));
            const outside = !(d.x > m || d.y > m);
            const wideSpan = d.x >= m || d.y >= m;
            const insideSpan = d.x <= m && d.y <= m;
            if (chunk.wireframe)
                chunk.wireframe.material =
                    wideSpan ? purple : blue;
            return insideSpan;
        }
        Chunks.Vis = Vis;
    })(Chunks || (Chunks = {}));
    var Chunks$1 = Chunks;

    // in 22 this separation was called the whatsit-thing;
    class Object2 {
        constructor(data) {
            // the Defaults
            if (!data.x)
                data.x = 0;
            if (!data.y)
                data.y = 0;
            if (!data.z)
                data.z = 0;
            if (!data.r)
                data.r = 0;
            if (!data.f)
                data.f = false;
            if (data.r > 3)
                data.r -= 4;
            if (data.r < 0)
                data.r += 4;
            this.data = data;
        }
        destroy() {
            this.destroyed = true;
            this.data.object2 = null;
        }
        update() {
        }
    }

    var BoxCutter;
    (function (BoxCutter) {
        const picks = [
            "OOOOO", "|OOOO", "O|OOO", "||OOO",
            "OO|OO", "|O|OO", "O||OO", "|||OO",
            "OOO|O", "|OO|O", "O|O|O", "||O|O",
            "OO||O", "|O||O", "O|||O", "||||O",
            "OOOO|", "|OOO|", "O|OO|", "||OO|",
            "OO|O|", "|O|O|", "O||O|", "|||O|",
            "OOO||", "|OO||", "O|O||", "||O||",
            "OO|||", "|O|||", "O||||", "|||||"
        ];
        BoxCutter.geometries = [];
        // Remove faces from a Box Buffer Geometry
        function init() {
            for (let bits of picks) {
                const geometry = Blocks$1.geometry.clone();
                BoxCutter.geometries[bits] = geometry;
                const attribs = geometry.attributes;
                const position = Array.from(attribs.position.array);
                const uv = Array.from(attribs.uv.array);
                const normal = Array.from(attribs.normal.array);
                for (let i = 5; i >= 0; i--) {
                    // Keep this face
                    if ('|' == bits[i])
                        continue;
                    position.splice(i * 12, 12);
                    uv.splice(i * 8, 8);
                    normal.splice(i * 12, 12);
                    attribs.position.count -= 4;
                    attribs.uv.count -= 4;
                    attribs.normal.count -= 4;
                    geometry.groups.splice(i, 1);
                    // three.js has .addGroup
                    for (let j = 0; j < geometry.groups.length; j++) {
                        let group = geometry.groups[j];
                        if (j < i)
                            continue;
                        group.start -= 6;
                    }
                    attribs.position.array = new Float32Array(position);
                    attribs.uv.array = new Float32Array(uv);
                    attribs.normal.array = new Float32Array(normal);
                }
            }
        }
        BoxCutter.init = init;
    })(BoxCutter || (BoxCutter = {}));
    var BoxCutter$1 = BoxCutter;

    var Util;
    (function (Util) {
        let mem = [];
        function loadTexture(file) {
            if (!file)
                return null;
            if (mem[file])
                return mem[file];
            let texture = new THREE.TextureLoader().load(file);
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            mem[file] = texture;
            return texture;
        }
        Util.loadTexture = loadTexture;
        let UV;
        (function (UV) {
            // usage sc.atlases['bad_roads_atlas'].side_line
            // Workhorse function
            function fromSheet(geometry, square, sheet) {
                const div = Math.floor(sheet.height / sheet.piece.h);
                let corrected_y = div - square.y;
                let x = (square.x - 1) * sheet.piece.w / sheet.width;
                let y = corrected_y * sheet.piece.h / sheet.height;
                let w = sheet.piece.w / sheet.width;
                let h = sheet.piece.h / sheet.height;
                if (sheet.padding) {
                    x += (square.x - 1) * sheet.padding / sheet.width;
                    y += (corrected_y) * sheet.padding / sheet.height;
                }
                UV.planarUV(geometry, 0, x, y, w, h);
            }
            UV.fromSheet = fromSheet;
            function planarUV(geom, face, x, y, w, h) {
                let o = face * 8;
                // 0 1, 1 1, 0 0, 1 0
                // left top, right top, left bottom, right bottom
                // [ x,y, x+w,y, x,y+h, x+w,y+h ]
                let a = [x, y + h, x + w, y + h, x, y, x + w, y];
                for (let i = 0; i < 8; i++) // coffee 0..7
                    geom.attributes.uv.array[o + i] = a[i];
                geom.attributes.uv.needsUpdate = true;
            }
            UV.planarUV = planarUV;
            function flipPlane(geom, face, flip) {
                const o = face * 8;
                const a = geom.attributes.uv.array;
                const flips = [[a[o + 0], a[o + 1], a[o + 2], a[o + 3], a[o + 4], a[o + 5], a[o + 6], a[o + 7]],
                    [a[o + 2], a[o + 3], a[o + 0], a[o + 1], a[o + 6], a[o + 7], a[o + 4], a[o + 5]]];
                const yn = (flip) ? 1 : 0;
                for (let i = 0; i < 8; i++)
                    geom.attributes.uv.array[o + i] = flips[yn][i];
                geom.attributes.uv.needsUpdate = true;
            }
            UV.flipPlane = flipPlane;
            function rotatePlane(geom, face, turns) {
                const o = face * 8;
                // 0 1, 1 1, 0 0, 1 0
                // left top, right top, left bottom, right bottom
                let a = geom.attributes.uv.array;
                switch (turns) {
                    case 1:
                        a = [a[o + 4], a[o + 5], a[o + 0], a[o + 1], a[o + 6], a[o + 7], a[o + 2], a[o + 3]];
                        break;
                    case 2:
                        a = [a[o + 6], a[o + 7], a[o + 4], a[o + 5], a[o + 2], a[o + 3], a[o + 0], a[o + 1]];
                        break;
                    case 3:
                        a = [a[o + 2], a[o + 3], a[o + 6], a[o + 7], a[o + 0], a[o + 1], a[o + 4], a[o + 5]];
                        break;
                }
                for (let i = 0; i < 8; i++)
                    geom.attributes.uv.array[o + i] = a[i];
                geom.attributes.uv.needsUpdate = true;
            }
            UV.rotatePlane = rotatePlane;
            function rotateUVs(uvs, o, turns) {
                let newy = new Array(o);
                newy.fill({});
                let f = o;
                let s = o + 1;
                switch (turns) {
                    case 1:
                        newy.push([
                            { x: uvs[f][1].x, y: uvs[f][1].y },
                            { x: uvs[s][1].x, y: uvs[s][1].y },
                            { x: uvs[f][0].x, y: uvs[f][0].y }
                        ]);
                        newy.push([
                            { x: uvs[s][1].x, y: uvs[s][1].y },
                            { x: uvs[f][2].x, y: uvs[f][2].y },
                            { x: uvs[f][0].x, y: uvs[f][0].y }
                        ]);
                        break;
                    case 2:
                        newy.push([
                            { x: uvs[s][1].x, y: uvs[s][1].y },
                            { x: uvs[s][2].x, y: uvs[s][2].y },
                            { x: uvs[s][0].x, y: uvs[s][0].y }
                        ]);
                        newy.push([
                            { x: uvs[f][2].x, y: uvs[f][2].y },
                            { x: uvs[f][0].x, y: uvs[f][0].y },
                            { x: uvs[f][1].x, y: uvs[f][1].y }
                        ]);
                        break;
                    case 3:
                        newy.push([
                            { x: uvs[f][2].x, y: uvs[f][2].y },
                            { x: uvs[f][0].x, y: uvs[f][0].y },
                            { x: uvs[s][1].x, y: uvs[s][1].y }
                        ]);
                        newy.push([
                            { x: uvs[f][0].x, y: uvs[f][0].y },
                            { x: uvs[s][0].x, y: uvs[s][0].y },
                            { x: uvs[s][1].x, y: uvs[s][1].y }
                        ]);
                        break;
                    default: return;
                }
                /*for j in [f..s]
                    for i in [0..2]
                        uvs[j][i].x = newy[j][i].x
                        uvs[j][i].y = newy[j][i].y*/
            }
            UV.rotateUVs = rotateUVs;
            function flipUVs(uvs, o, flip) {
                let a = [[[0, 1], [0, 0], [1, 1]], [[0, 0], [1, 0], [1, 1]]];
                let b = [[[1, 1], [1, 0], [0, 1]], [[1, 0], [0, 0], [0, 1]]];
                let c = (flip) ? b : a;
                // left top
                uvs[o][0].x = c[0][0][0];
                uvs[o][0].y = c[0][0][1];
                // left bottom
                uvs[o][1].x = c[0][1][0];
                uvs[o][1].y = c[0][1][1];
                // right top
                uvs[o][2].x = c[0][2][0];
                uvs[o][2].y = c[0][2][1];
                // left bottom
                uvs[o + 1][0].x = c[1][0][0];
                uvs[o + 1][0].y = c[1][0][1];
                // right bottom
                uvs[o + 1][1].x = c[1][1][0];
                uvs[o + 1][1].y = c[1][1][1];
                // right top
                uvs[o + 1][2].x = c[1][2][0];
                uvs[o + 1][2].y = c[1][2][1];
            }
            UV.flipUVs = flipUVs;
        })(UV = Util.UV || (Util.UV = {}));
    })(Util || (Util = {}));
    var Util$1 = Util;

    var Blocks;
    (function (Blocks) {
        function init() {
            Blocks.geometry = new THREE.BoxBufferGeometry(64, 64, 64);
            Util$1.UV.rotatePlane(Blocks.geometry, 0, 3);
            Util$1.UV.rotatePlane(Blocks.geometry, 1, 1);
            Util$1.UV.rotatePlane(Blocks.geometry, 2, 2);
        }
        Blocks.init = init;
        function getBits(data) {
            let str = '';
            for (let i = 0; i < 5; i++)
                str += data.faces[i] ? '|' : 'O';
            str = str.toString().replace(/[\s,]/g, '');
            return str;
        }
        function getBox(block) {
            let bits = getBits(block);
            let box = BoxCutter$1.geometries[bits];
            return box.clone();
        }
        Blocks.getBox = getBox;
        function show(block) {
            Four$1.scene.add(block.mesh);
        }
        Blocks.show = show;
        function hide(block) {
            Four$1.scene.remove(block.mesh);
        }
        Blocks.hide = hide;
    })(Blocks || (Blocks = {}));
    var Blocks$1 = Blocks;

    class Block extends Object2 {
        constructor(data) {
            super(data);
            // the Defaults
            if (!this.data.faces)
                this.data.faces = [];
            this.make();
            Blocks$1.show(this);
        }
        // Override
        destroy() {
            super.destroy();
            this.geometry.dispose();
            let i = 0;
            for (; i < 6; i++) {
                this.materials[i].dispose();
            }
        }
        make() {
            this.materials = [];
            {
                this.geometry = Blocks$1.getBox(this.data);
            }
            let i = 0;
            let faceCount = -1;
            for (; i < 6; i++) {
                let sty = this.data.faces[i] || this.data.sty;
                if (!sty)
                    continue;
                faceCount++;
                let mat = new THREE.MeshPhongMaterial({
                    map: Util$1.loadTexture(sty),
                    color: new THREE.Color(this.data.color)
                });
                this.materials[i] = mat;
                // Now, see if this is upside
                if (this.geometry.groups[faceCount].materialIndex != 4)
                    continue;
                if (this.data.f)
                    Util$1.UV.flipPlane(this.geometry, faceCount, true);
                if (this.data.r)
                    Util$1.UV.rotatePlane(this.geometry, faceCount, this.data.r);
            }
            this.mesh = new THREE.Mesh(this.geometry, this.materials);
            this.mesh.matrixAutoUpdate = false;
            this.mesh.frustumCulled = false;
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.position.set(this.data.x * 64 + 32, this.data.y * 64 + 32, this.data.z * 64 + 32);
            this.mesh.updateMatrix();
        }
    }

    var Surfaces;
    (function (Surfaces) {
        function init() {
            this.geometry = new THREE__default.PlaneBufferGeometry(64, 64, 1, 1);
        }
        Surfaces.init = init;
        function show(plane) {
            Four$1.scene.add(plane.mesh);
        }
        Surfaces.show = show;
        function hide(plane) {
            Four$1.scene.remove(plane.mesh);
        }
        Surfaces.hide = hide;
    })(Surfaces || (Surfaces = {}));
    var Surfaces$1 = Surfaces;

    var Spritesheets;
    (function (Spritesheets) {
        function Get(index) {
            if (!index)
                return;
            let value = sheets[index];
            if (!value)
                console.warn('Spritesheet not found');
            return value;
        }
        Spritesheets.Get = Get;
        function init() {
            Spritesheets.canvas = document.createElement('canvas');
            document.body.appendChild(Spritesheets.canvas);
            console.log('Spritesheets init');
        }
        Spritesheets.init = init;
        const sheets = {
            badRoads: {
                file: 'sty/sheets/bad_roads.png',
                squares: {
                    clear: { x: 1, y: 2 },
                    middleTracks: { x: 2, y: 2 },
                    middleCorner: { x: 3, y: 2 },
                    sideClear: { x: 1, y: 1 },
                    sideClearAlt: { x: 1, y: 1 },
                    sideLine: { x: 4, y: 1 },
                    sideDash: { x: 3, y: 1 },
                    sideStop: { x: 2, y: 4 },
                    sideStopLine: { x: 5, y: 1 },
                    sideStopDash: { x: 5, y: 2 },
                    parkingSpot: { x: 1, y: 4 },
                    customNotch: { x: 3, y: 4 },
                    single: { x: 1, y: 3 },
                    singleExit: { x: 2, y: 3 },
                    singleCorner: { x: 3, y: 3 },
                    singleOpen: { x: 3, y: 5 },
                    corner: { x: 4, y: 3 },
                    convex: { x: 4, y: 5 },
                    convexLine: { x: 5, y: 5 },
                    sideDecal: { x: 1, y: 5 },
                    sideDecal_2: { x: 2, y: 5 },
                },
                width: 320,
                height: 320,
                piece: { w: 64, h: 64 }
            },
            greenRoads: {
                file: 'sty/sheets/green_roads.png',
                squares: {
                    clear: { x: 1, y: 2 },
                    middleTracks: { x: 2, y: 2 },
                    middleCorner: { x: 3, y: 2 },
                    sideClear: { x: 1, y: 1 },
                    sideClearAlt: { x: 1, y: 1 },
                    sideLine: { x: 4, y: 1 },
                    sideDash: { x: 3, y: 1 },
                    sideStop: { x: 2, y: 4 },
                    sideStopLine: { x: 5, y: 1 },
                    sideStopDash: { x: 5, y: 2 },
                    parkingSpot: { x: 1, y: 4 },
                    customNotch: { x: 3, y: 4 },
                    single: { x: 1, y: 3 },
                    singleExit: { x: 2, y: 3 },
                    singleCorner: { x: 3, y: 3 },
                    singleOpen: { x: 3, y: 5 },
                    corner: { x: 4, y: 3 },
                    convex: { x: 4, y: 5 },
                    convexLine: { x: 5, y: 5 },
                    sideDecal: { x: 1, y: 5 },
                    sideDecal_2: { x: 2, y: 5 },
                },
                width: 320,
                height: 320,
                piece: { w: 64, h: 64 }
            },
            mixedRoads: {
                file: 'sty/sheets/mixed_roads.png',
                squares: {
                    clear: { x: 1, y: 2 },
                    middleTracks: { x: 2, y: 2 },
                    middleCorner: { x: 3, y: 2 },
                    sideClear: { x: 1, y: 1 },
                    sideClearAlt: { x: 1, y: 1 },
                    sideLine: { x: 4, y: 1 },
                    sideDash: { x: 3, y: 1 },
                    sideStop: { x: 2, y: 4 },
                    sideStopLine: { x: 5, y: 1 },
                    sideStopDash: { x: 5, y: 2 },
                    parkingSpot: { x: 1, y: 4 },
                    customNotch: { x: 3, y: 4 },
                    single: { x: 1, y: 3 },
                    singleExit: { x: 2, y: 3 },
                    singleCorner: { x: 3, y: 3 },
                    singleOpen: { x: 3, y: 5 },
                    corner: { x: 4, y: 3 },
                    convex: { x: 4, y: 5 },
                    convexLine: { x: 5, y: 5 },
                    sideDecal: { x: 1, y: 5 },
                    sideDecal_2: { x: 2, y: 5 },
                },
                width: 320,
                height: 320,
                piece: { w: 64, h: 64 }
            },
            greyRoads: {
                file: 'sty/sheets/grey_roads.png',
                squares: {
                    clear: { x: 1, y: 2 },
                    middleTracks: { x: 2, y: 2 },
                    middleCorner: { x: 3, y: 2 },
                    sideClear: { x: 1, y: 1 },
                    sideClearAlt: { x: 1, y: 1 },
                    sideLine: { x: 4, y: 1 },
                    sideDash: { x: 3, y: 1 },
                    sideStop: { x: 2, y: 4 },
                    sideStopLine: { x: 5, y: 1 },
                    sideStopDash: { x: 5, y: 2 },
                    parkingSpot: { x: 1, y: 4 },
                    customNotch: { x: 3, y: 4 },
                    single: { x: 1, y: 3 },
                    singleExit: { x: 2, y: 3 },
                    singleCorner: { x: 3, y: 3 },
                    singleOpen: { x: 3, y: 5 },
                    corner: { x: 4, y: 3 },
                    convex: { x: 4, y: 5 },
                    convexLine: { x: 5, y: 5 },
                    sideDecal: { x: 1, y: 5 },
                    sideDecal_2: { x: 2, y: 5 },
                },
                width: 320,
                height: 320,
                piece: { w: 64, h: 64 }
            },
            yellowyPavement: {
                file: 'sty/sheets/yellowy_pavement.png',
                squares: {
                    middle: { x: 1, y: 1 },
                },
                width: 256,
                height: 256,
                piece: { w: 64, h: 64 }
            },
            greenPavement: {
                file: 'sty/sheets/green_pavement.png',
                squares: {
                    middle: { x: 1, y: 1 },
                    sideShadowed: { x: 2, y: 1 },
                    sidePaved: { x: 3, y: 1 },
                    sidePavedShadowed: { x: 4, y: 1 },
                    sidePavedShadowedVent: { x: 3, y: 3 },
                    sideLineEnd: { x: 3, y: 1 },
                },
                width: 256,
                height: 256,
                piece: { w: 64, h: 64 }
            }
        };
    })(Spritesheets || (Spritesheets = {}));
    var Spritesheets$1 = Spritesheets;

    class Surface extends Object2 {
        constructor(data) {
            super(data);
            // the Defaults
            //if (!this.data.color) this.data.color = 'white';
            //if (!this.data2.faces) this.data2.faces = [];
            this.make();
        }
        // Override
        destroy() {
            super.destroy();
            Surfaces$1.hide(this);
            this.geometry.dispose();
            this.material.dispose();
            delete this.mesh;
            delete this.geometry;
            delete this.material;
        }
        make() {
            this.geometry = Surfaces$1.geometry.clone();
            const hasSheet = this.data.sheet && this.data.square;
            let map;
            if (hasSheet) {
                let spritesheet = Spritesheets$1.Get(this.data.sheet);
                let square = spritesheet.squares[this.data.square];
                /*
                // compat
                if (CUT) {
                    const key = `sh ${this.data.sheet} sq ${this.data.square}`;

                    map = Sprites.Cut(square, sheet, key);
                }*/
                //else {
                map = Util$1.loadTexture(spritesheet.file);
                map.wrapS = THREE__default.ClampToEdgeWrapping;
                map.wrapT = THREE__default.ClampToEdgeWrapping;
                Util$1.UV.fromSheet(this.geometry, square, spritesheet);
                //}
            }
            else {
                map = Util$1.loadTexture(this.data.sty);
            }
            this.material = new THREE.MeshPhongMaterial({
                map: map,
                shininess: 0,
                color: new THREE.Color(this.data.color),
                side: THREE.DoubleSide
            });
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.matrixAutoUpdate = false;
            this.mesh.frustumCulled = false;
            this.mesh.castShadow = false;
            this.mesh.receiveShadow = true;
            this.mesh.position.set(this.data.x * 64 + 32, this.data.y * 64 + 32, this.data.z * 64);
            this.mesh.updateMatrix();
            if (this.data.f)
                Util$1.UV.flipPlane(this.geometry, 0, true);
            if (this.data.r)
                Util$1.UV.rotatePlane(this.geometry, 0, this.data.r);
            Surfaces$1.show(this);
        }
        slope() {
            if (!this.data.slope)
                return;
            for (let i in this.data.slope) {
                let p = this.geometry.getAttribute('position').array;
                //this.geometry.attributes.position.needsUpdate = true;
                const slope = this.data.slope[i];
                /*switch (i) {
                    case 0:
                        p[2] = pts;
                        p[5] = pts;
                        break;
                    case 1:
                        p[5] = pts;
                        p[11] = pts;
                        break;
                    case 2:
                        p[8] = pts;
                        p[11] = pts;
                        break;
                    case 3:
                        p[2] = pts;
                        p[8] = pts;
                }*/
            }
        }
    }

    // "C API" LOL
    var Rectangles;
    (function (Rectangles) {
        function init() {
        }
        Rectangles.init = init;
        function show(rectangle) {
            console.log('Rectangles add ' + rectangle.data.type);
            Four$1.scene.add(rectangle.mesh);
            Four$1.scene.add(rectangle.meshShadow);
        }
        Rectangles.show = show;
        function hide(rectangle) {
            Four$1.scene.remove(rectangle.mesh);
            Four$1.scene.remove(rectangle.meshShadow);
        }
        Rectangles.hide = hide;
    })(Rectangles || (Rectangles = {}));
    var Rectangles$1 = Rectangles;

    var Phong2;
    (function (Phong2) {
        // Taken from
        // https://raw.githubusercontent.com/mrdoob/three.js/dev/src/renderers/shaders/ShaderLib/meshphong_frag.glsl.js
        //var customMaterial: THREE.ShaderMaterial;
        function rig() {
        }
        Phong2.rig = rig;
        function make(phongProperties, p) {
            let customMaterial = new THREE.MeshPhongMaterial(phongProperties);
            customMaterial.onBeforeCompile = (shader) => {
                if (p.blurMap)
                    shader.uniforms.blurMap = { value: p.blurMap };
                shader.uniforms.pink = { value: new THREE.Vector3(1, 0, 1) };
                shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `
				#define PHONG
				#define PHONG2
				`
                    +
                        (p.blurMap ? '#define BLUR \n' : '') +
                    (p.PINK ? '#define PINK \n' : '') +
                    `
				
				#ifdef BLUR
					uniform sampler2D blurMap;
				#endif
			`);
                shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
				#ifdef USE_MAP
				
					vec4 texelColor = vec4(0);
					
					vec4 mapColor = texture2D( map, vUv );

					#ifdef PINK
						// Pink pixels
						if ( mapColor.rgb == vec3(1, 0, 1) ) {
							mapColor.a = 0.0;
							mapColor.rgb *= 0.0;
						}
					#endif

					#ifdef BLUR
						vec4 blurColor = texture2D( blurMap, vUv );
						blurColor.rgb *= 0.0;
						blurColor.a /= 1.5;
						texelColor = blurColor + mapColor;
					#else
						texelColor = mapColor;
					#endif

					texelColor = mapTexelToLinear( texelColor );

					diffuseColor *= texelColor;

				#endif
			`);
            }; // onBeforeCompile
            return customMaterial;
        }
        Phong2.make = make;
    })(Phong2 || (Phong2 = {}));
    var Phong2$1 = Phong2;

    class Rectangle extends Object2 {
        constructor(data) {
            super(data);
            this.lift = 2;
            // the Defaults
            if (!this.data.width)
                this.data.width = 20;
            if (!this.data.height)
                this.data.height = 20;
            this.where = new THREE.Vector3;
            //Ready(); // used by consumer class
        }
        makeRectangle(params) {
            this.makeMeshes(params);
            this.updatePosition();
            Rectangles$1.show(this);
        }
        makeMeshes(info) {
            let map = Util$1.loadTexture(this.data.sty);
            let blurMap = Util$1.loadTexture(info.blur);
            let shadowMap = Util$1.loadTexture(info.blur);
            this.geometry = new THREE.PlaneBufferGeometry(this.data.width, this.data.height, 1);
            this.material = Phong2$1.make({
                name: 'Phong2',
                transparent: true,
                map: map,
            }, {
                blurMap: blurMap,
                PINK: true
            });
            /*let materialShadow = new MeshBasicMaterial({
                map: Util.loadTexture(this.data.sty),
                //color: 0x0,
                transparent: true
            });*/
            let materialShadow = Phong2$1.make({
                name: 'Phong2',
                transparent: true,
                map: shadowMap,
            }, {
                map: shadowMap,
                PINK: true,
                DARKEN: true
            });
            materialShadow.opacity = 0.5;
            materialShadow.color = new THREE__default.Color(0x0);
            this.mesh = new THREE__default.Mesh(this.geometry, this.material);
            this.mesh.frustumCulled = false;
            this.meshShadow = new THREE__default.Mesh(this.geometry, materialShadow);
            this.meshShadow.frustumCulled = false;
        }
        destroy() {
            super.destroy();
            Rectangles$1.hide(this);
            this.geometry.dispose();
            this.material.dispose();
        }
        update() {
            super.update();
        }
        updatePosition() {
            this.where.set(this.data.x * 64, this.data.y * 64, this.data.z * 64);
            this.mesh.position.copy(this.where);
            this.mesh.position.z += this.lift;
            // Shade
            this.meshShadow.position.copy(this.where);
            this.meshShadow.position.x += 3;
            this.meshShadow.position.y -= 3;
            //this.meshShadow.position.z += 3;
            this.mesh.rotation.z = this.data.r;
            this.meshShadow.rotation.z = this.data.r;
        }
    }

    var CarMetas;
    (function (CarMetas) {
        function getNullable(name) {
            const meta = list[name];
            if (!meta) {
                console.warn('Car Metas null');
                return null;
            }
            return meta;
        }
        CarMetas.getNullable = getNullable;
        const list = {
            "Romero": {
                "IMG_WIDTH": 62,
                "IMG_HEIGHT": 64,
                "GOOD": "ye"
            },
            "Wellard": {
                "IMG_WIDTH": 44,
                "IMG_HEIGHT": 64,
                "GOOD": "ye",
                "ENGINE_TYPE": 3
            },
            "Aniston BD4": {
                "IMG_WIDTH": 62,
                "IMG_HEIGHT": 64,
                "GOOD": "ye",
                "ENGINE_TYPE": 2
            },
            "Pacifier": {
                "IMG_WIDTH": 50,
                "IMG_HEIGHT": 98,
                "GOOD": "ye",
                "COLORLESS": true,
                "DELTA_TRANSPARENCY": [
                    1,
                    1,
                    1
                ],
                "ENGINE_TYPE": 6,
                "AIR_BRAKES": true
            },
            "G4 Bank Van": {
                "IMG_WIDTH": 60,
                "IMG_HEIGHT": 104,
                "GOOD": "ye",
                "COLORLESS": true,
                "ENGINE_TYPE": 4
            },
            "Beamer": {
                "IMG_WIDTH": 62,
                "IMG_HEIGHT": 64,
                "GOOD": "ye"
            },
            "Box Car": {
                "IMG_WIDTH": 42,
                "IMG_HEIGHT": 128,
                "NOTE": "the box car is a train",
                "GOOD": "ye",
                "COLORLESS": true,
                "NO_SPAWN": true
            },
            "Box Truck": {
                "IMG_WIDTH": 52,
                "IMG_HEIGHT": 128,
                "ENGINE_TYPE": 5,
                "AIR_BRAKES": true
            },
            "Bug": {
                "IMG_WIDTH": 50,
                "IMG_HEIGHT": 52,
                "GOOD": "ye",
                "ENGINE_TYPE": 1
            },
            "Bulwark": {
                "IMG_WIDTH": 64,
                "IMG_HEIGHT": 64
            },
            "Bus": {
                "IMG_WIDTH": 52,
                "IMG_HEIGHT": 128,
                "GOOD": "ye",
                "AIR_BRAKES": true,
                "COLORLESS": true
            },
            "Cop Car": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 64,
                "GOOD": "ye",
                "COLORLESS": true
            },
            "Minx": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 58,
                "GOOD": "ye"
            },
            "Eddy": {
                "IMG_WIDTH": 54,
                "IMG_HEIGHT": 62,
                "GOOD": "ye",
                "COLORLESS": true
            },
            "Panto": {
                "IMG_WIDTH": 62,
                "IMG_HEIGHT": 56,
                "GOOD": "ye",
                "ENGINE_TYPE": 1
            },
            "Fire Truck": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 124,
                "ENGINE_TYPE": 5,
                "AIR_BRAKES": true,
                "GOOD": "ye",
                "COLORLESS": true
            },
            "Shark": {
                "IMG_WIDTH": 54,
                "IMG_HEIGHT": 64,
                "GOOD": "ye"
            },
            "GT-A1": {
                "IMG_WIDTH": 54,
                "IMG_HEIGHT": 64
            },
            "Garbage Truck": {
                "IMG_WIDTH": 52,
                "IMG_HEIGHT": 86,
                "GOOD": "ye",
                "COLORLESS": true,
                "ENGINE_TYPE": 5,
                "AIR_BRAKES": true
            },
            "Armed Land Roamer": {
                "IMG_WIDTH": 42,
                "IMG_HEIGHT": 48,
                "GOOD": "ye",
                "COLORLESS": true
            },
            "Hot Dog Van": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 88,
                "GOOD": "ye",
                "COLORLESS": true,
                "ENGINE_TYPE": 4
            },
            "Ice-Cream Van": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 88,
                "GOOD": "ye",
                "COLORLESS": true,
                "ENGINE_TYPE": 4
            },
            "Dementia Limousine": {
                "IMG_WIDTH": 48,
                "IMG_HEIGHT": 78,
                "GOOD": "ye"
            },
            "Dementia": {
                "IMG_WIDTH": 50,
                "IMG_HEIGHT": 46,
                "GOOD": "ye"
            },
            "Land Roamer": {
                "IMG_WIDTH": 42,
                "IMG_HEIGHT": 48,
                "GOOD": "ye",
                "COLORLESS": true
            },
            "Jefferson": {
                "IMG_WIDTH": 46,
                "IMG_HEIGHT": 62,
                "ENGINE_TYPE": 3
            },
            "Stretch Limousine": {
                "IMG_WIDTH": 60,
                "IMG_HEIGHT": 112
            },
            "Sports Limousine": {
                "IMG_WIDTH": 56,
                "IMG_HEIGHT": 110
            },
            "Medicar": {
                "IMG_WIDTH": 62,
                "IMG_HEIGHT": 114,
                "GOOD": "ye",
                "COLORLESS": true
            },
            "Benson": {
                "IMG_WIDTH": 38,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 2
            },
            "Schmidt": {
                "IMG_WIDTH": 38,
                "IMG_HEIGHT": 56,
                "ENGINE_TYPE": 1
            },
            "Miara": {
                "IMG_WIDTH": 62,
                "IMG_HEIGHT": 64,
                "GOOD": "ye",
                "ENGINE_TYPE": 3
            },
            "Big Bug": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 58,
                "ENGINE_TYPE": 1
            },
            "Morton": {
                "IMG_WIDTH": 48,
                "IMG_HEIGHT": 60,
                "ENGINE_TYPE": 1
            },
            "Maurice": {
                "IMG_WIDTH": 56,
                "IMG_HEIGHT": 58
            },
            "Pickup": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 1
            },
            "A-Type": {
                "IMG_WIDTH": 60,
                "IMG_HEIGHT": 64
            },
            "Arachnid": {
                "IMG_WIDTH": 54,
                "IMG_HEIGHT": 62
            },
            "Spritzer": {
                "IMG_WIDTH": 60,
                "IMG_HEIGHT": 56,
                "ENGINE_TYPE": 0
            },
            "Stinger": {
                "IMG_WIDTH": 52,
                "IMG_HEIGHT": 62,
                "ENGINE_TYPE": 2
            },
            "Meteor": {
                "IMG_WIDTH": 60,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 3
            },
            "Meteor Turbo": {
                "IMG_WIDTH": 60,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 3
            },
            "Hachura": {
                "IMG_WIDTH": 64,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 3
            },
            "B-Type": {
                "IMG_WIDTH": 56,
                "IMG_HEIGHT": 64
            },
            "Taxi Xpress": {
                "IMG_WIDTH": 56,
                "IMG_HEIGHT": 64,
                "COLORLESS": true
            },
            "SWAT Van": {
                "IMG_WIDTH": 64,
                "IMG_HEIGHT": 98,
                "GOOD": "ye",
                "COLORLESS": true,
                "ENGINE_TYPE": 4
            },
            "Michelli Roadster": {
                "IMG_WIDTH": 50,
                "IMG_HEIGHT": 64,
                "GOOD": "ye"
            },
            "Tank": {
                "IMG_WIDTH": 46,
                "IMG_HEIGHT": 82,
                "GOOD": "ye",
                "COLORLESS": true,
                "ENGINE_TYPE": 6,
                "MAX_SPEED_ORIG": 0.1
            },
            "Tanker": {
                "IMG_WIDTH": 40,
                "IMG_HEIGHT": 128,
                "NO_SPAWN": true,
                "COLORLESS": true
            },
            "Taxi": {
                "IMG_WIDTH": 60,
                "IMG_HEIGHT": 64,
                "GOOD": "ye",
                "COLORLESS": true
            },
            "T-Rex": {
                "IMG_WIDTH": 60,
                "IMG_HEIGHT": 64
            },
            "Tow Truck": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 80,
                "GOOD": "ye",
                "ENGINE_TYPE": 5,
                "AIR_BRAKES": true,
                "COLORLESS": true
            },
            "Train": {
                "IMG_WIDTH": 42,
                "IMG_HEIGHT": 128,
                "COLORLESS": true,
                "NO_SPAWN": true
            },
            "Train Cab": {
                "IMG_WIDTH": 40,
                "IMG_HEIGHT": 128,
                "COLORLESS": true,
                "NO_SPAWN": true
            },
            "Train FB": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 74,
                "COLORLESS": true,
                "NO_SPAWN": true
            },
            "Trance-Am": {
                "IMG_WIDTH": 54,
                "IMG_HEIGHT": 64,
                "GOOD": "ye",
                "ENGINE_TYPE": 3
            },
            "Truck Cab": {
                "IMG_WIDTH": 64,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 5,
                "AIR_BRAKES": true,
                "MAX_SPEED_ORIG": 0.175
            },
            "Truck Cab SX": {
                "IMG_WIDTH": 64,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 5,
                "AIR_BRAKES": true,
                "MAX_SPEED_ORIG": 0.165
            },
            "Container": {
                "IMG_WIDTH": 42,
                "IMG_HEIGHT": 128,
                "COLORLESS": true,
                "NO_SPAWN": true
            },
            "Transporter": {
                "IMG_WIDTH": 40,
                "IMG_HEIGHT": 128,
                "NOTE": "this is a trailer",
                "COLORLESS": true,
                "NO_SPAWN": true
            },
            "TV Van": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 74,
                "ENGINE_TYPE": 4
            },
            "Van": {
                "IMG_WIDTH": 58,
                "IMG_HEIGHT": 74,
                "ENGINE_TYPE": 4
            },
            "U-Jerk Truck": {
                "IMG_WIDTH": 54,
                "IMG_HEIGHT": 56,
                "ENGINE_TYPE": 1
            },
            "Z-Type": {
                "IMG_WIDTH": 56,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 3
            },
            "Rumbler": {
                "IMG_WIDTH": 56,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 3
            },
            "Jagular XK": {
                "IMG_WIDTH": 52,
                "IMG_HEIGHT": 64
            },
            "Furore GT": {
                "IMG_WIDTH": 50,
                "IMG_HEIGHT": 64,
                "ENGINE_TYPE": 3
            },
            "Special Agent Car": {
                "IMG_WIDTH": 64,
                "IMG_HEIGHT": 64,
                "NOTE": "this is an eddy with remap 2 (black)",
                "NO_SPAWN": true
            },
            "Karma Bus": {
                "IMG_WIDTH": 44,
                "IMG_HEIGHT": 100,
                "GOOD": "ye",
                "COLORLESS": true,
                "AIR_BRAKES": true
            }
        };
    })(CarMetas || (CarMetas = {}));

    var CarPhysics;
    (function (CarPhysics) {
        function getNullable(name) {
            const car = list[name];
            if (!car) {
                console.warn('a physic lines are null ' + name);
                return null;
            }
            return car;
        }
        CarPhysics.getNullable = getNullable;
        function List() {
            return list;
        }
        CarPhysics.List = List;
        const list = {
            'Romero': {
                'model': 0,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 16.5,
                'front drive bias': 1,
                'front mass bias': 0.5,
                'brake friction': 1.75,
                'turn in': 0.145,
                'turn ratio': 0.45,
                'rear end stability': 1.25,
                'handbrake slide value': 0.18,
                'thrust': 0.152,
                'max_speed': 0.245,
                'anti strength': 1,
                'skid threshhold': 0.065,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.68,
                'gear3 multiplier': 1,
                'gear2 speed': 0.107,
                'gear3 speed': 0.165,
            },
            'Wellard': {
                'model': 1,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14.5,
                'front drive bias': 1,
                'front mass bias': 0.55,
                'brake friction': 2,
                'turn in': 0.65,
                'turn ratio': 0.35,
                'rear end stability': 1.5,
                'handbrake slide value': 0.25,
                'thrust': 0.22,
                'max_speed': 0.38,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.5,
                'gear2 multiplier': 0.65,
                'gear3 multiplier': 1,
                'gear2 speed': 0.125,
                'gear3 speed': 0.228,
            },
            'Aniston BD4': {
                'model': 2,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14.5,
                'front drive bias': 0.6,
                'front mass bias': 0.5,
                'brake friction': 1.75,
                'turn in': 0.145,
                'turn ratio': 0.45,
                'rear end stability': 1.25,
                'handbrake slide value': 0.18,
                'thrust': 0.146,
                'max_speed': 0.3,
                'anti strength': 1,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.725,
                'gear3 multiplier': 1,
                'gear2 speed': 0.11,
                'gear3 speed': 0.175,
            },
            'Pacifier': {
                'model': 3,
                'turbo': 0,
                'value': 30,
                'pad': 0,
                'mass': 27,
                'front drive bias': 0.5,
                'front mass bias': 0.6,
                'brake friction': 0.9,
                'turn in': 0.25,
                'turn ratio': 0.75,
                'rear end stability': 1.8,
                'handbrake slide value': 0.15,
                'thrust': 0.225,
                'max_speed': 0.247,
                'anti strength': 0.5,
                'skid threshhold': 0.1,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.103,
                'gear3 speed': 0.192,
            },
            'G4 Bank Van': {
                'model': 4,
                'turbo': 0,
                'value': 25,
                'pad': 0,
                'mass': 24,
                'front drive bias': 0.5,
                'front mass bias': 0.5,
                'brake friction': 1.5,
                'turn in': 0.5,
                'turn ratio': 0.4,
                'rear end stability': 2,
                'handbrake slide value': 0.75,
                'thrust': 0.17,
                'max_speed': 0.186,
                'anti strength': 0.5,
                'skid threshhold': 0.075,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.675,
                'gear3 multiplier': 1,
                'gear2 speed': 0.081,
                'gear3 speed': 0.13,
            },
            'Beamer': {
                'model': 5,
                'turbo': 1,
                'value': 40,
                'pad': 0,
                'mass': 16,
                'front drive bias': 1,
                'front mass bias': 0.6,
                'brake friction': 3,
                'turn in': 0.75,
                'turn ratio': 0.4,
                'rear end stability': 2,
                'handbrake slide value': 0.5,
                'thrust': 0.15,
                'max_speed': 0.385,
                'anti strength': 1,
                'skid threshhold': 0.14,
                'gear1 multiplier': 0.575,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.185,
                'gear3 speed': 0.275,
            },
            'Box Car': {
                'model': 6,
                'turbo': 0,
                'value': 200,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.9,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0.143,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
            },
            'Box Truck': {
                'model': 7,
                'turbo': 0,
                'value': 90,
                'pad': 0,
                'mass': 28,
                'front drive bias': 0.5,
                'front mass bias': 0.7,
                'brake friction': 2,
                'turn in': 0.25,
                'turn ratio': 0.65,
                'rear end stability': 2.5,
                'handbrake slide value': 0.45,
                'thrust': 0.185,
                'max_speed': 0.175,
                'anti strength': 0.75,
                'skid threshhold': 0.065,
                'gear1 multiplier': 0.545,
                'gear2 multiplier': 0.675,
                'gear3 multiplier': 1,
                'gear2 speed': 0.088,
                'gear3 speed': 0.114,
            },
            'Bug': {
                'model': 8,
                'turbo': 0,
                'value': 10,
                'pad': 0,
                'mass': 6.3,
                'front drive bias': 1,
                'front mass bias': 0.45,
                'brake friction': 1.265,
                'turn in': 0.3,
                'turn ratio': 0.175,
                'rear end stability': 1.5,
                'handbrake slide value': 0.65,
                'thrust': 0.095,
                'max_speed': 0.235,
                'anti strength': 1,
                'skid threshhold': 0.05,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.625,
                'gear3 multiplier': 1,
                'gear2 speed': 0.125,
                'gear3 speed': 0.152,
            },
            'Bulwark': {
                'model_corrected': 9,
                'model': 10,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 17,
                'front drive bias': 1,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.14,
                'turn ratio': 0.45,
                'rear end stability': 1.5,
                'handbrake slide value': 0.35,
                'thrust': 0.185,
                'max_speed': 0.307,
                'anti strength': 0.8,
                'skid threshhold': 0.075,
                'gear1 multiplier': 0.65,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.155,
                'gear3 speed': 0.225,
            },
            'Bus': {
                'model_corrected': 10,
                'model': 11,
                'turbo': 0,
                'value': 60,
                'pad': 0,
                'mass': 30,
                'front drive bias': 0.5,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.25,
                'turn ratio': 0.65,
                'rear end stability': 2.5,
                'handbrake slide value': 0.75,
                'thrust': 0.235,
                'max_speed': 0.215,
                'anti strength': 0.75,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.1,
                'gear3 speed': 0.161,
            },
            'Cop Car': {
                'model_corrected': 11,
                'model': 12,
                'turbo': 1,
                'value': 60,
                'pad': 0,
                'mass': 14.5,
                'front drive bias': 1,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.433,
                'turn ratio': 0.4,
                'rear end stability': 1.25,
                'handbrake slide value': 0.4,
                'thrust': 0.15,
                'max_speed': 0.415,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.68,
                'gear3 multiplier': 1,
                'gear2 speed': 0.18,
                'gear3 speed': 0.29,
            },
            'Minx': {
                'model_corrected': 12,
                'model': 13,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14.5,
                'front drive bias': 0.75,
                'front mass bias': 0.5,
                'brake friction': 1.75,
                'turn in': 0.145,
                'turn ratio': 0.45,
                'rear end stability': 1.25,
                'handbrake slide value': 0.18,
                'thrust': 0.14,
                'max_speed': 0.24,
                'anti strength': 1,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.68,
                'gear3 multiplier': 1,
                'gear2 speed': 0.12,
                'gear3 speed': 0.166,
            },
            'Eddy': {
                'model_corrected': 13,
                'model': 14,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 15,
                'front drive bias': 1,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.14,
                'turn ratio': 0.4,
                'rear end stability': 1.2,
                'handbrake slide value': 0.35,
                'thrust': 0.165,
                'max_speed': 0.3,
                'anti strength': 0.8,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.12,
                'gear3 speed': 0.197,
            },
            'Panto': {
                'model_corrected': 14,
                'model': 16,
                'turbo': 0,
                'value': 10,
                'pad': 0,
                'mass': 7,
                'front drive bias': 1,
                'front mass bias': 0.5,
                'brake friction': 1.5,
                'turn in': 0.25,
                'turn ratio': 0.3,
                'rear end stability': 1,
                'handbrake slide value': 0.2,
                'thrust': 0.058,
                'max_speed': 0.165,
                'anti strength': 1.25,
                'skid threshhold': 0.04,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.082,
                'gear3 speed': 0.12,
            },
            'Fire Truck': {
                'model_corrected': 15,
                'model': 17,
                'turbo': 0,
                'value': 60,
                'pad': 0,
                'mass': 32,
                'front drive bias': 0.7,
                'front mass bias': 0.46,
                'brake friction': 2.7,
                'turn in': 0.85,
                'turn ratio': 0.75,
                'rear end stability': 0.55,
                'handbrake slide value': 0.2,
                'thrust': 0.233,
                'max_speed': 0.255,
                'anti strength': 1,
                'skid threshhold': 0.15,
                'gear1 multiplier': 0.575,
                'gear2 multiplier': 0.775,
                'gear3 multiplier': 1,
                'gear2 speed': 0.124,
                'gear3 speed': 0.19,
            },
            'Shark': {
                'model_corrected': 16,
                'model': 18,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 17,
                'front drive bias': 1,
                'front mass bias': 0.75,
                'brake friction': 1.5,
                'turn in': 0.65,
                'turn ratio': 0.65,
                'rear end stability': 1,
                'handbrake slide value': 0.3,
                'thrust': 0.23,
                'max_speed': 0.36,
                'anti strength': 1,
                'skid threshhold': 0.1,
                'gear1 multiplier': 0.5,
                'gear2 multiplier': 0.6,
                'gear3 multiplier': 1,
                'gear2 speed': 0.125,
                'gear3 speed': 0.22,
            },
            'GT-A1': {
                'model_corrected': 17,
                'model': 19,
                'turbo': 1,
                'value': 60,
                'pad': 0,
                'mass': 14.5,
                'front drive bias': 0.5,
                'front mass bias': 0.5,
                'brake friction': 1.75,
                'turn in': 0.4,
                'turn ratio': 0.35,
                'rear end stability': 1.25,
                'handbrake slide value': 0.4,
                'thrust': 0.175,
                'max_speed': 0.45,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.725,
                'gear3 multiplier': 1,
                'gear2 speed': 0.225,
                'gear3 speed': 0.35,
            },
            'Garbage Truck': {
                'model_corrected': 18,
                'model': 21,
                'turbo': 0,
                'value': 40,
                'pad': 0,
                'mass': 28,
                'front drive bias': 0.5,
                'front mass bias': 0.3,
                'brake friction': 2.5,
                'turn in': 0.25,
                'turn ratio': 0.55,
                'rear end stability': 2,
                'handbrake slide value': 0.35,
                'thrust': 0.155,
                'max_speed': 0.162,
                'anti strength': 1,
                'skid threshhold': 0.075,
                'gear1 multiplier': 0.65,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.085,
                'gear3 speed': 0.12,
            },
            'Armed Land Roamer': {
                'model_corrected': 24,
                'model': 22,
                'turbo': 0,
                'value': 30,
                'pad': 0,
                'mass': 12,
                'front drive bias': 0.5,
                'front mass bias': 0.6,
                'brake friction': 1.75,
                'turn in': 0.55,
                'turn ratio': 0.35,
                'rear end stability': 1.3,
                'handbrake slide value': 0.175,
                'thrust': 0.13,
                'max_speed': 0.24,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.6,
                'gear3 multiplier': 1,
                'gear2 speed': 0.12,
                'gear3 speed': 0.152,
            },
            'Hot Dog Van': {
                'model_corrected': 20,
                'model': 23,
                'turbo': 0,
                'value': 30,
                'pad': 0,
                'mass': 24,
                'front drive bias': 0.5,
                'front mass bias': 0.3,
                'brake friction': 2,
                'turn in': 0.45,
                'turn ratio': 0.6,
                'rear end stability': 1.15,
                'handbrake slide value': 0.2,
                'thrust': 0.188,
                'max_speed': 0.241,
                'anti strength': 1,
                'skid threshhold': 0.07,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.63,
                'gear3 multiplier': 1,
                'gear2 speed': 0.094,
                'gear3 speed': 0.146,
            },
            'Ice-Cream Van': {
                'model_corrected': 21,
                'model': 27,
                'turbo': 0,
                'value': 30,
                'pad': 0,
                'mass': 20,
                'front drive bias': 0.5,
                'front mass bias': 0.4,
                'brake friction': 2,
                'turn in': 0.45,
                'turn ratio': 0.6,
                'rear end stability': 1.15,
                'handbrake slide value': 0.2,
                'thrust': 0.16,
                'max_speed': 0.227,
                'anti strength': 1,
                'skid threshhold': 0.07,
                'gear1 multiplier': 0.5,
                'gear2 multiplier': 0.65,
                'gear3 multiplier': 1,
                'gear2 speed': 0.08,
                'gear3 speed': 0.142,
            },
            'Dementia Limousine': {
                'model_corrected': 22,
                'model': 28,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 16,
                'front drive bias': 0.5,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.125,
                'turn ratio': 0.5,
                'rear end stability': 1.2,
                'handbrake slide value': 0.2,
                'thrust': 0.15,
                'max_speed': 0.235,
                'anti strength': 1,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.111,
                'gear3 speed': 0.173,
            },
            'Dementia': {
                'model_corrected': 23,
                'model': 29,
                'turbo': 0,
                'value': 10,
                'pad': 0,
                'mass': 6.3,
                'front drive bias': 1,
                'front mass bias': 0.45,
                'brake friction': 1.265,
                'turn in': 0.3,
                'turn ratio': 0.175,
                'rear end stability': 1.5,
                'handbrake slide value': 0.65,
                'thrust': 0.095,
                'max_speed': 0.235,
                'anti strength': 1,
                'skid threshhold': 0.05,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.625,
                'gear3 multiplier': 1,
                'gear2 speed': 0.125,
                'gear3 speed': 0.152,
            },
            'Land Roamer': {
                'model_corrected': 24,
                'model': 30,
                'turbo': 0,
                'value': 5,
                'pad': 0,
                'mass': 12,
                'front drive bias': 0.5,
                'front mass bias': 0.6,
                'brake friction': 1.75,
                'turn in': 0.55,
                'turn ratio': 0.35,
                'rear end stability': 1.3,
                'handbrake slide value': 0.175,
                'thrust': 0.13,
                'max_speed': 0.24,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.6,
                'gear3 multiplier': 1,
                'gear2 speed': 0.12,
                'gear3 speed': 0.152,
            },
            'Jefferson': {
                'model_corrected': 25,
                'model': 31,
                'turbo': 1,
                'value': 50,
                'pad': 0,
                'mass': 16,
                'front drive bias': 1,
                'front mass bias': 0.75,
                'brake friction': 2,
                'turn in': 0.65,
                'turn ratio': 0.45,
                'rear end stability': 0.9,
                'handbrake slide value': 0.2,
                'thrust': 0.15,
                'max_speed': 0.4,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.2,
                'gear3 speed': 0.3,
            },
            'Stretch Limousine': {
                'model_corrected': 27,
                'model': 32,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 24,
                'front drive bias': 0.5,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.25,
                'turn ratio': 0.65,
                'rear end stability': 0.8,
                'handbrake slide value': 0.2,
                'thrust': 0.21,
                'max_speed': 0.275,
                'anti strength': 0.75,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.12,
                'gear3 speed': 0.215,
            },
            'Sports Limousine': {
                'model_corrected': 28,
                'model': 33,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 24,
                'front drive bias': 1,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.2,
                'turn ratio': 0.6,
                'rear end stability': 0.75,
                'handbrake slide value': 0.2,
                'thrust': 0.22,
                'max_speed': 0.295,
                'anti strength': 0.75,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.135,
                'gear3 speed': 0.23,
            },
            'Medicar': {
                'model_corrected': 29,
                'model': 34,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 20,
                'front drive bias': 0.5,
                'front mass bias': 0.475,
                'brake friction': 2.75,
                'turn in': 0.25,
                'turn ratio': 0.5,
                'rear end stability': 0.7,
                'handbrake slide value': 0.275,
                'thrust': 0.231,
                'max_speed': 0.338,
                'anti strength': 1,
                'skid threshhold': 0.1,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.135,
                'gear3 speed': 0.237,
            },
            'Benson': {
                'model_corrected': 30,
                'model': 35,
                'turbo': 1,
                'value': 60,
                'pad': 0,
                'mass': 15.5,
                'front drive bias': 0.5,
                'front mass bias': 0.35,
                'brake friction': 2,
                'turn in': 0.25,
                'turn ratio': 0.4,
                'rear end stability': 1.9,
                'handbrake slide value': 0.35,
                'thrust': 0.14,
                'max_speed': 0.35,
                'anti strength': 1,
                'skid threshhold': 0.105,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.165,
                'gear3 speed': 0.251,
            },
            'Schmidt': {
                'model_corrected': 31,
                'model': 36,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 8,
                'front drive bias': 0.5,
                'front mass bias': 0.3,
                'brake friction': 2,
                'turn in': 0.55,
                'turn ratio': 0.25,
                'rear end stability': 2,
                'handbrake slide value': 0.15,
                'thrust': 0.09,
                'max_speed': 0.2,
                'anti strength': 1.25,
                'skid threshhold': 0.03,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.1,
                'gear3 speed': 0.15,
            },
            'Miara': {
                'model_corrected': 32,
                'model': 37,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14.5,
                'front drive bias': 1,
                'front mass bias': 0.65,
                'brake friction': 2,
                'turn in': 0.25,
                'turn ratio': 0.4,
                'rear end stability': 1.25,
                'handbrake slide value': 0.15,
                'thrust': 0.195,
                'max_speed': 0.35,
                'anti strength': 1,
                'skid threshhold': 0.12,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.145,
                'gear3 speed': 0.245,
            },
            'Big Bug': {
                'model_corrected': 33,
                'model': 38,
                'turbo': 0,
                'value': 30,
                'pad': 0,
                'mass': 22,
                'front drive bias': 0.5,
                'front mass bias': 0.4,
                'brake friction': 2,
                'turn in': 0.1,
                'turn ratio': 0.6,
                'rear end stability': 1.5,
                'handbrake slide value': 0.2,
                'thrust': 0.2,
                'max_speed': 0.24,
                'anti strength': 1,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.104,
                'gear3 speed': 0.175,
            },
            'Morton': {
                'model_corrected': 34,
                'model': 39,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 16.5,
                'front drive bias': 0.5,
                'front mass bias': 0.6,
                'brake friction': 2,
                'turn in': 0.45,
                'turn ratio': 0.55,
                'rear end stability': 0.9,
                'handbrake slide value': 0.2,
                'thrust': 0.152,
                'max_speed': 0.265,
                'anti strength': 1,
                'skid threshhold': 0.135,
                'gear1 multiplier': 0.65,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.125,
                'gear3 speed': 0.19,
            },
            'Maurice': {
                'model_corrected': 35,
                'model': 40,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 13,
                'front drive bias': 1,
                'front mass bias': 0.4,
                'brake friction': 1.75,
                'turn in': 0.25,
                'turn ratio': 0.35,
                'rear end stability': 1.25,
                'handbrake slide value': 0.25,
                'thrust': 0.14,
                'max_speed': 0.26,
                'anti strength': 1,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.68,
                'gear3 multiplier': 1,
                'gear2 speed': 0.12,
                'gear3 speed': 0.175,
            },
            'Pickup': {
                'model_corrected': 36,
                'model': 41,
                'turbo': 0,
                'value': 15,
                'pad': 0,
                'mass': 16,
                'front drive bias': 0.5,
                'front mass bias': 0.6,
                'brake friction': 2,
                'turn in': 0.5,
                'turn ratio': 0.45,
                'rear end stability': 0.5,
                'handbrake slide value': 0.2,
                'thrust': 0.135,
                'max_speed': 0.255,
                'anti strength': 1,
                'skid threshhold': 0.08,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.12,
                'gear3 speed': 0.19,
            },
            'A-Type': {
                'model_corrected': 37,
                'model': 42,
                'turbo': 1,
                'value': 50,
                'pad': 0,
                'mass': 15,
                'front drive bias': 1,
                'front mass bias': 0.6,
                'brake friction': 2,
                'turn in': 0.45,
                'turn ratio': 0.45,
                'rear end stability': 1,
                'handbrake slide value': 0.5,
                'thrust': 0.126,
                'max_speed': 0.385,
                'anti strength': 1,
                'skid threshhold': 0.118,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.175,
                'gear3 speed': 0.272,
            },
            'Arachnid': {
                'model_corrected': 38,
                'model': 44,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14.5,
                'front drive bias': 1,
                'front mass bias': 0.5,
                'brake friction': 1.75,
                'turn in': 0.145,
                'turn ratio': 0.45,
                'rear end stability': 1,
                'handbrake slide value': 0.18,
                'thrust': 0.152,
                'max_speed': 0.285,
                'anti strength': 1,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.725,
                'gear3 multiplier': 1,
                'gear2 speed': 0.135,
                'gear3 speed': 0.2,
            },
            'Spritzer': {
                'model_corrected': 39,
                'model': 45,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14,
                'front drive bias': 0.5,
                'front mass bias': 0.55,
                'brake friction': 2.5,
                'turn in': 0.145,
                'turn ratio': 0.4,
                'rear end stability': 1,
                'handbrake slide value': 0.55,
                'thrust': 0.125,
                'max_speed': 0.235,
                'anti strength': 1,
                'skid threshhold': 0.065,
                'gear1 multiplier': 0.65,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.125,
                'gear3 speed': 0.162,
            },
            'Stinger': {
                'model_corrected': 40,
                'model': 46,
                'turbo': 1,
                'value': 50,
                'pad': 0,
                'mass': 15,
                'front drive bias': 0.6,
                'front mass bias': 0.6,
                'brake friction': 3,
                'turn in': 0.1,
                'turn ratio': 0.65,
                'rear end stability': 1,
                'handbrake slide value': 0.3,
                'thrust': 0.14,
                'max_speed': 0.401,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.174,
                'gear3 speed': 0.285,
            },
            'Meteor': {
                'model_corrected': 41,
                'model': 47,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 13.5,
                'front drive bias': 0.5,
                'front mass bias': 0.6,
                'brake friction': 2,
                'turn in': 0.35,
                'turn ratio': 0.5,
                'rear end stability': 0.9,
                'handbrake slide value': 0.2,
                'thrust': 0.16,
                'max_speed': 0.32,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.7,
                'gear2 multiplier': 0.85,
                'gear3 multiplier': 1,
                'gear2 speed': 0.185,
                'gear3 speed': 0.265,
            },
            'Meteor Turbo': {
                'model_corrected': 42,
                'model': 48,
                'turbo': 1,
                'value': 60,
                'pad': 0,
                'mass': 14.5,
                'front drive bias': 0.5,
                'front mass bias': 0.6,
                'brake friction': 1.75,
                'turn in': 0.45,
                'turn ratio': 0.4,
                'rear end stability': 1.3,
                'handbrake slide value': 0.4,
                'thrust': 0.175,
                'max_speed': 0.42,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.725,
                'gear3 multiplier': 1,
                'gear2 speed': 0.235,
                'gear3 speed': 0.36,
            },
            'Hachura': {
                'model_corrected': 43,
                'model': 49,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14,
                'front drive bias': 0.75,
                'front mass bias': 0.6,
                'brake friction': 2,
                'turn in': 0.35,
                'turn ratio': 0.55,
                'rear end stability': 0.9,
                'handbrake slide value': 0.2,
                'thrust': 0.225,
                'max_speed': 0.4,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.5,
                'gear2 multiplier': 0.72,
                'gear3 multiplier': 1,
                'gear2 speed': 0.185,
                'gear3 speed': 0.3,
            },
            'B-Type': {
                'model_corrected': 44,
                'model': 50,
                'turbo': 1,
                'value': 50,
                'pad': 0,
                'mass': 15,
                'front drive bias': 0.6,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.1,
                'turn ratio': 0.5,
                'rear end stability': 0.85,
                'handbrake slide value': 0.2,
                'thrust': 0.14,
                'max_speed': 0.401,
                'anti strength': 1,
                'skid threshhold': 0.125,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.174,
                'gear3 speed': 0.29,
            },
            'Taxi Xpress': {
                'model_corrected': 45,
                'model': 51,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 15,
                'front drive bias': 1,
                'front mass bias': 0.6,
                'brake friction': 2,
                'turn in': 0.4,
                'turn ratio': 0.4,
                'rear end stability': 0.7,
                'handbrake slide value': 0.2,
                'thrust': 0.145,
                'max_speed': 0.27,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.65,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.135,
                'gear3 speed': 0.21,
            },
            'SWAT Van': {
                'model_corrected': 46,
                'model': 52,
                'turbo': 0,
                'value': 90,
                'pad': 0,
                'mass': 22,
                'front drive bias': 0.5,
                'front mass bias': 0.6,
                'brake friction': 2,
                'turn in': 0.25,
                'turn ratio': 0.8,
                'rear end stability': 1.4,
                'handbrake slide value': 0.3,
                'thrust': 0.175,
                'max_speed': 0.225,
                'anti strength': 0.5,
                'skid threshhold': 0.13,
                'gear1 multiplier': 0.65,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.115,
                'gear3 speed': 0.166,
            },
            'Michelli Roadster': {
                'model_corrected': 47,
                'model': 53,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 13,
                'front drive bias': 1,
                'front mass bias': 0.8,
                'brake friction': 1,
                'turn in': 0.175,
                'turn ratio': 0.5,
                'rear end stability': 0.75,
                'handbrake slide value': 0.35,
                'thrust': 0.175,
                'max_speed': 0.388,
                'anti strength': 1,
                'skid threshhold': 0.1,
                'gear1 multiplier': 0.65,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.165,
                'gear3 speed': 0.275,
            },
            'Tank': {
                'model_corrected': 48,
                'model': 54,
                'turbo': 0,
                'value': 95,
                'pad': 0,
                'mass': 45,
                'front drive bias': 0.5,
                'front mass bias': 0.5,
                'brake friction': 4,
                'turn in': 0.25,
                'turn ratio': 0.75,
                'rear end stability': 4,
                'handbrake slide value': 0,
                'thrust': 0.29,
                'max_speed': 0.2,
                'anti strength': 0.25,
                'skid threshhold': 0.5,
                'gear1 multiplier': 0.53,
                'gear2 multiplier': 0.6,
                'gear3 multiplier': 1,
                'gear2 speed': 0.05,
                'gear3 speed': 0.06,
            },
            'Tanker': {
                'model': 55,
                'turbo': 0,
                'value': 80,
                'pad': 0,
                'mass': 30,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.3,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
            },
            'Taxi': {
                'model_corrected': 50,
                'model': 56,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14.5,
                'front drive bias': 1,
                'front mass bias': 0.55,
                'brake friction': 2.5,
                'turn in': 0.15,
                'turn ratio': 0.45,
                'rear end stability': 1,
                'handbrake slide value': 0.2,
                'thrust': 0.13,
                'max_speed': 0.219,
                'anti strength': 1,
                'skid threshhold': 0.065,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.125,
                'gear3 speed': 0.175,
            },
            'T-Rex': {
                'model_corrected': 51,
                'model': 57,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 15.5,
                'front drive bias': 1,
                'front mass bias': 0.55,
                'brake friction': 2,
                'turn in': 0.35,
                'turn ratio': 0.35,
                'rear end stability': 0.95,
                'handbrake slide value': 0.35,
                'thrust': 0.225,
                'max_speed': 0.405,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.65,
                'gear3 multiplier': 1,
                'gear2 speed': 0.175,
                'gear3 speed': 0.255,
            },
            'Tow Truck': {
                'model_corrected': 52,
                'model': 58,
                'turbo': 0,
                'value': 30,
                'pad': 0,
                'mass': 22,
                'front drive bias': 0.5,
                'front mass bias': 0.8,
                'brake friction': 2.5,
                'turn in': 0.5,
                'turn ratio': 0.8,
                'rear end stability': 1,
                'handbrake slide value': 0.85,
                'thrust': 0.15,
                'max_speed': 0.2,
                'anti strength': 1,
                'skid threshhold': 0.13,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.65,
                'gear3 multiplier': 1,
                'gear2 speed': 0.1,
                'gear3 speed': 0.133,
            },
            'Train': {
                'model': 59,
                'turbo': 0,
                'value': 200,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0.143,
                'max_speed': 0.399,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
            },
            'Train Cab': {
                'model': 60,
                'turbo': 0,
                'value': 200,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0.143,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
            },
            'Train FB': {
                'model': 61,
                'turbo': 0,
                'value': 200,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0.143,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
            },
            'Trance-Am': {
                'model_corrected': 56,
                'model': 62,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14,
                'front drive bias': 1,
                'front mass bias': 0.5,
                'brake friction': 3,
                'turn in': 0.1,
                'turn ratio': 0.4,
                'rear end stability': 0.85,
                'handbrake slide value': 0.3,
                'thrust': 0.165,
                'max_speed': 0.34,
                'anti strength': 1,
                'skid threshhold': 0.09,
                'gear1 multiplier': 0.65,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.25,
            },
            'Truck Cab': {
                'model_corrected': 57,
                'model': 63,
                'turbo': 0,
                'value': 40,
                'pad': 0,
                'mass': 19,
                'front drive bias': 1,
                'front mass bias': 0.75,
                'brake friction': 1.75,
                'turn in': 0.75,
                'turn ratio': 0.7,
                'rear end stability': 3,
                'handbrake slide value': 0.1,
                'thrust': 0.175,
                'max_speed': 0.2,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.45,
                'gear2 multiplier': 0.6,
                'gear3 multiplier': 1,
                'gear2 speed': 0.075,
                'gear3 speed': 0.108,
            },
            'Truck Cab SX': {
                'model_corrected': 58,
                'model': 64,
                'turbo': 0,
                'value': 40,
                'pad': 0,
                'mass': 19,
                'front drive bias': 0.487,
                'front mass bias': 0.189,
                'brake friction': 2,
                'turn in': 0,
                'turn ratio': 0.527,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0.3,
                'max_speed': 0.2,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.075,
                'gear3 speed': 0.108,
            },
            'Container': {
                'model_corrected': 59,
                'model': 65,
                'turbo': 0,
                'value': 60,
                'pad': 0,
                'mass': 30,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.2,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0,
                'gear3 speed': 0,
            },
            'Transporter': {
                'model_corrected': 60,
                'model': 66,
                'turbo': 0,
                'value': 70,
                'pad': 0,
                'mass': 30,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.2,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0,
                'gear3 speed': 0,
            },
            'TV Van': {
                'model_corrected': 61,
                'model': 67,
                'turbo': 0,
                'value': 20,
                'pad': 0,
                'mass': 19,
                'front drive bias': 0.5,
                'front mass bias': 0.8,
                'brake friction': 2.5,
                'turn in': 0.5,
                'turn ratio': 0.8,
                'rear end stability': 1,
                'handbrake slide value': 0.85,
                'thrust': 0.15,
                'max_speed': 0.205,
                'anti strength': 1,
                'skid threshhold': 0.13,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.65,
                'gear3 multiplier': 1,
                'gear2 speed': 0.1,
                'gear3 speed': 0.14,
            },
            'Van': {
                'model': 61,
                'turbo': 0,
                'value': 20,
                'pad': 0,
                'mass': 19,
                'front drive bias': 0.5,
                'front mass bias': 0.8,
                'brake friction': 2.5,
                'turn in': 0.5,
                'turn ratio': 0.8,
                'rear end stability': 1,
                'handbrake slide value': 0.85,
                'thrust': 0.15,
                'max_speed': 0.205,
                'anti strength': 1,
                'skid threshhold': 0.13,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.65,
                'gear3 multiplier': 1,
                'gear2 speed': 0.1,
                'gear3 speed': 0.14,
            },
            'U-Jerk Truck': {
                'model_corrected': 62,
                'model': 69,
                'turbo': 0,
                'value': 20,
                'pad': 0,
                'mass': 16,
                'front drive bias': 0.5,
                'front mass bias': 0.75,
                'brake friction': 2,
                'turn in': 0.75,
                'turn ratio': 0.5,
                'rear end stability': 0.25,
                'handbrake slide value': 0.2,
                'thrust': 0.11,
                'max_speed': 0.225,
                'anti strength': 1,
                'skid threshhold': 0.11,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.085,
                'gear3 speed': 0.15,
            },
            'Z-Type': {
                'model_corrected': 44,
                'model': 70,
                'turbo': 1,
                'value': 50,
                'pad': 0,
                'mass': 15,
                'front drive bias': 1,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.4,
                'turn ratio': 0.35,
                'rear end stability': 1.175,
                'handbrake slide value': 0.4,
                'thrust': 0.145,
                'max_speed': 0.405,
                'anti strength': 1,
                'skid threshhold': 0.12,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.19,
                'gear3 speed': 0.284,
            },
            'Rumbler': {
                'model_corrected': 64,
                'model': 71,
                'turbo': 1,
                'value': 50,
                'pad': 0,
                'mass': 15,
                'front drive bias': 0.5,
                'front mass bias': 0.375,
                'brake friction': 3.5,
                'turn in': 0.25,
                'turn ratio': 0.65,
                'rear end stability': 1.4,
                'handbrake slide value': 0.35,
                'thrust': 0.14,
                'max_speed': 0.401,
                'anti strength': 1,
                'skid threshhold': 0.115,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.175,
                'gear3 speed': 0.27,
            },
            /*'Wreck 0': {
                'model': 72,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 36,
                'image_height': 112
            },
            'Wreck 1': {
                'model': 73,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 40,
                'image_height': 74
            },
            'Wreck 2': {
                'model': 74,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 46,
                'image_height': 82
            },
            'Wreck 3': {
                'model': 75,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 52,
                'image_height': 64
            },
            'Wreck 4': {
                'model': 76,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 50,
                'image_height': 64
            },
            'Wreck 5': {
                'model': 77,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 64,
                'image_height': 64
            },
            'Wreck 6': {
                'model': 78,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 64,
                'image_height': 64
            },
            'Wreck 7': {
                'model': 79,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 64,
                'image_height': 64
            },
            'Wreck 8': {
                'model': 80,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 64,
                'image_height': 64
            },
            'Wreck 9': {
                'model': 81,
                'turbo': 0,
                'value': 0,
                'pad': 0,
                'mass': 10,
                'front drive bias': 0,
                'front mass bias': 0.5,
                'brake friction': 0.9,
                'turn in': 0.1,
                'turn ratio': 0.8,
                'rear end stability': 2,
                'handbrake slide value': 0.2,
                'thrust': 0,
                'max_speed': 0.95,
                'anti strength': 1,
                'skid threshhold': 0.139,
                'gear1 multiplier': 0.6,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.152,
                'gear3 speed': 0.228,
                'image_width': 64,
                'image_height': 64
            },*/
            'Jagular XK': {
                'model_corrected': 75,
                'model': 82,
                'turbo': 0,
                'value': 50,
                'pad': 0,
                'mass': 14,
                'front drive bias': 0.5,
                'front mass bias': 0.5,
                'brake friction': 2,
                'turn in': 0.35,
                'turn ratio': 0.45,
                'rear end stability': 1.4,
                'handbrake slide value': 0.35,
                'thrust': 0.185,
                'max_speed': 0.33,
                'anti strength': 1,
                'skid threshhold': 0.105,
                'gear1 multiplier': 0.65,
                'gear2 multiplier': 0.8,
                'gear3 multiplier': 1,
                'gear2 speed': 0.18,
                'gear3 speed': 0.255,
            },
            'Furore GT': {
                'model_corrected': 76,
                'model': 83,
                'turbo': 1,
                'value': 50,
                'pad': 0,
                'mass': 14.104,
                'front drive bias': 0.156,
                'front mass bias': 0.61,
                'brake friction': 2.015,
                'turn in': 0.063,
                'turn ratio': 0.993,
                'rear end stability': 0.85,
                'handbrake slide value': 0.1,
                'thrust': 0.142,
                'max_speed': 0.416,
                'anti strength': 1,
                'skid threshhold': 0.142,
                'gear1 multiplier': 0.626,
                'gear2 multiplier': 0.797,
                'gear3 multiplier': 1,
                'gear2 speed': 0.235,
                'gear3 speed': 0.35,
            },
            'Special Agent Car': {
                'model': 84,
                'turbo': 0,
                'value': 70,
                'pad': 0,
                'mass': 15,
                'front drive bias': 1,
                'front mass bias': 0.6,
                'brake friction': 2,
                'turn in': 0.155,
                'turn ratio': 0.45,
                'rear end stability': 1.2,
                'handbrake slide value': 0.35,
                'thrust': 0.165,
                'max_speed': 0.3,
                'anti strength': 0.8,
                'skid threshhold': 0.085,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.7,
                'gear3 multiplier': 1,
                'gear2 speed': 0.13,
                'gear3 speed': 0.195,
            },
            'Karma Bus': {
                'model_corrected': 26,
                'model': 86,
                'turbo': 0,
                'value': 30,
                'pad': 0,
                'mass': 22,
                'front drive bias': 0.5,
                'front mass bias': 0.4,
                'brake friction': 2,
                'turn in': 0.45,
                'turn ratio': 0.6,
                'rear end stability': 1.15,
                'handbrake slide value': 0.2,
                'thrust': 0.165,
                'max_speed': 0.275,
                'anti strength': 1,
                'skid threshhold': 0.07,
                'gear1 multiplier': 0.55,
                'gear2 multiplier': 0.75,
                'gear3 multiplier': 1,
                'gear2 speed': 0.115,
                'gear3 speed': 0.165,
            }
        };
    })(CarPhysics || (CarPhysics = {}));
    var CarPhysics$1 = CarPhysics;

    class Car extends Rectangle {
        constructor(data) {
            super(data);
            console.log('Car ' + data.carName);
            if (!data.carName)
                console.warn('Car data has no carName!');
            // Defaults
            if (!data.paint)
                data.paint = Math.floor(Math.random() * 35);
            this.lift = 1;
            const meta = CarMetas.getNullable(data.carName);
            const physics = CarPhysics$1.getNullable(data.carName);
            const model = physics.model_corrected || physics.model;
            if (meta.COLORLESS)
                data.sty = `sty/car/painted/GTA2_CAR_${model}.bmp`;
            else
                data.sty = `sty/car/painted/GTA2_CAR_${model}_PAL_${data.paint}.bmp`;
            data.width = meta.IMG_WIDTH;
            data.height = meta.IMG_HEIGHT;
            this.makeRectangle({
                blur: `sty/car/blurs/GTA2_CAR_${model}.png`,
                shadow: data.sty
            });
        }
    }

    var Objects;
    (function (Objects) {
        function factory(data) {
            switch (data.type) {
                //case 'Ped': return new Ped(data);
                //case 'Player': return new Player(data);
                case 'Car': return new Car(data);
                case 'Block': return new Block(data);
                case 'Surface': return new Surface(data);
                //case 'Lamp': return new Lamp(data);
                default:
                    return null;
            }
        }
        function makeNullable(data) {
            if (data.object2)
                console.warn('Data has object2');
            let object = factory(data);
            if (!object)
                console.warn('Object2 not typable');
            data.object2 = object;
            return object || null;
        }
        Objects.makeNullable = makeNullable;
    })(Objects || (Objects = {}));
    var Objects$1 = Objects;

    // A chunk makes / destroys its datas / objects
    class Chunk {
        constructor(w) {
            //console.log(`chunk ${w.x} & ${w.y}`);
            this.currentlyActive = false;
            this.group = new THREE.Group;
            this.w = w;
            this.datas = [];
            this.objects = [];
            //Chunks.Scaffold(this);
        }
        update() {
            for (let object of this.objects)
                object.update();
        }
        fabricate(data) {
            let object = Objects$1.makeNullable(data);
            if (!object)
                return;
            this.objects.push(object);
        }
        add(data) {
            this.datas.push(data);
            if (this.currentlyActive) {
                this.fabricate(data);
                console.warn('active add');
            }
        }
        remove(data) {
            this.datas.splice(this.datas.indexOf(data), 1);
            let object = data.object2;
            if (!object)
                return;
            object.destroy();
            this.objects.splice(this.objects.indexOf(object), 1);
        }
        makeAdd() {
            //console.log('Chunk make n add');
            for (let data of this.datas)
                this.fabricate(data);
            this.currentlyActive = true;
            Four$1.scene.add(this.group);
        }
        destroyRemove() {
            //console.log('Chunk destroy n remove');
            for (let object of this.objects)
                object.destroy();
            this.objects.length = 0; // Reset array
            this.currentlyActive = false;
            Four$1.scene.remove(this.group);
        }
    }
    Chunk._tileSpan = 7; // use Chunks.tileSpan

    // Simple getters and chunk creation
    class ChunkList {
        constructor() {
            this.dict = {};
        }
        getNullable(w) {
            let z = `${w.x} & ${w.y}`;
            let chunk = this.dict[z];
            return chunk || null;
        }
        get2(x, y) {
            return this.get({ x: x, y: y });
        }
        get(w) {
            let z = `${w.x} & ${w.y}`;
            let chunk = this.dict[z];
            if (!chunk) {
                chunk = new Chunk(w);
                this.dict[z] = chunk;
            }
            return chunk;
        }
    }

    // aka data maker
    var Datas;
    (function (Datas) {
        //export function Floor(data: Data2) {
        //	data.x = Math.floor(data.x);
        //	data.y = Math.floor(data.y);
        //}
        function big(data) {
            let w = Points$1.make(Math.floor(data.x / Chunks$1.tileSpan), Math.floor(data.y / Chunks$1.tileSpan));
            return w;
        }
        Datas.big = big;
        function getChunk(data) {
            let w = big(data);
            let chunk = KILL$1.city.chunkList.get(w);
            return chunk;
        }
        Datas.getChunk = getChunk;
        function deliver(data) {
            let chunk = getChunk(data);
            chunk.add(data);
        }
        Datas.deliver = deliver;
        function replaceDeliver(A) {
            let chunk = getChunk(A);
            let C;
            for (let B of chunk.datas) {
                if (B.type == 'Car')
                    continue;
                if (A.x == B.x &&
                    A.y == B.y &&
                    A.z == B.z) {
                    C = B;
                    chunk.remove(B);
                }
            }
            if (C && C.sheet && A.adapt_sheet)
                A.sheet = C.sheet;
            chunk.add(A);
        }
        Datas.replaceDeliver = replaceDeliver;
        // for testing
        window.Datas__ = Datas;
    })(Datas || (Datas = {}));
    var Datas$1 = Datas;

    class City {
        constructor() {
            this.chunks = [];
            this.chunkList = new ChunkList;
            this.new = Points$1.make(0, 0);
            this.old = Points$1.make(100, 100);
        }
        update(p) {
            this.new = Datas$1.big(p);
            if (Points$1.same(this.new, this.old))
                return;
            console.log(`${this.old.x} & ${this.old.y} different to ${this.new.x} & ${this.new.y}`);
            this.old = Points$1.copy(this.new);
            this.off();
            this.on();
            for (let chunk of this.chunks) {
                chunk.update();
            }
        }
        // Find chunks outside the wide span
        // and turn them off with a negative for-loop
        off() {
            const to = this.new;
            let i = this.chunks.length;
            while (i--) {
                let ch = this.chunks[i];
                if (!Chunks$1.Vis(ch, to)) {
                    this.chunks.splice(i, 1);
                    ch.destroyRemove();
                }
            }
        }
        // Now turn on any new areas inside
        // the small span
        on() {
            const to = this.new;
            const m = Math.floor(City.spanUneven / 2);
            for (let y = 0; y < City.spanUneven; y++) {
                for (let x = 0; x < City.spanUneven; x++) {
                    let z = Points$1.make(x - m + to.x, y - m + to.y);
                    let ch = this.chunkList.getNullable(z);
                    if (!ch)
                        continue;
                    if (!ch.currentlyActive) {
                        this.chunks.push(ch);
                        ch.makeAdd();
                        Chunks$1.Vis(ch, to);
                    }
                }
            }
        }
    }
    City.spanUneven = 5;

    var Anims;
    (function (Anims) {
        function zero(a) {
            a.timer = 0;
            a.i = 0;
        }
        Anims.zero = zero;
        function update(a) {
            a.timer += Four$1.delta;
            if (a.timer < a.def.moment)
                return;
            const end = a.i + 1 == a.def.frames;
            !end ? a.i++ : a.i = 0;
            a.timer = 0;
        }
        Anims.update = update;
    })(Anims || (Anims = {}));
    var Anims$1 = Anims;

    //import { three } from "../three";
    var Peds;
    (function (Peds) {
        function play(ped, word, square = undefined) {
            const timer = ped.timers[word];
            Anims$1.update(timer);
            Util$1.UV.fromSheet(ped.geometry, square || timer.def.tiles[timer.i], Peds.sheet);
            return timer;
        }
        Peds.play = play;
        Peds.sheet = {
            file: 'ped/template_24.png',
            width: 33 * 8,
            height: 33 * 23,
            squares: {
                lol: { x: 0, y: 0 }
            },
            piece: {
                w: 33,
                h: 33
            }
        };
    })(Peds || (Peds = {}));
    var Peds$1 = Peds;

    const walkSquares = [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 1 },
        { x: 5, y: 1 },
        { x: 6, y: 1 },
        { x: 7, y: 1 },
        { x: 8, y: 1 }
    ];
    const runSquares = [
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 5, y: 2 },
        { x: 6, y: 2 },
        { x: 7, y: 2 },
        { x: 8, y: 2 }
    ];
    const scratchSquares = [
        { x: 1, y: 8 },
        { x: 2, y: 8 },
        { x: 3, y: 8 },
        { x: 4, y: 8 },
        { x: 5, y: 8 },
        { x: 6, y: 8 },
        { x: 7, y: 8 },
        { x: 8, y: 8 },
        { x: 1, y: 9 },
        { x: 2, y: 9 },
        { x: 3, y: 9 },
        { x: 4, y: 9 }
    ];
    const m = .11;
    const pedDefs = {
        other: { frames: 8, moment: .08 },
        walk: { frames: 8, moment: .11, tiles: walkSquares },
        run: { frames: 8, moment: .08, tiles: runSquares },
        scratch: { frames: 12, moment: .16, tiles: scratchSquares },
        punch: { frames: 8, moment: m },
        walkpunch: { frames: 8, moment: m },
        runpunch: { frames: 8, moment: .08 },
        walkgun: { frames: 8, moment: m },
        rungun: { frames: 8, moment: .08 },
        jump: { frames: 8, moment: m },
        door: { frames: 8, moment: .14 },
        sit: { frames: 5, moment: m },
        drop: { frames: 8, moment: m },
        trip1: { frames: 9, moment: m },
        trip2: { frames: 8, moment: m },
        drown: { frames: 8, moment: m },
        cardoor: { frames: 8, moment: .13 }
    };

    const idleSquare = { x: 1, y: 8 };
    class Ped extends Rectangle {
        constructor(data) {
            super(data);
            this.idle = true;
            this.run = false;
            this.move = true;
            this.timers = {};
            // Defaults
            if (!data.remap)
                data.remap = 15 + Math.floor(Math.random() * 53 - 15);
            data.height = data.width = 33;
            if (data.sty) ;
            data.sty = `sty/ped/template_${data.remap}.png`;
            // Todo, Avarage ped only uses two
            // maybe make a Get for this in Anims
            for (let property in pedDefs) {
                this.timers[property] =
                    {
                        def: pedDefs[property],
                        i: 0,
                        timer: 0
                    };
            }
            this.makeRectangle({
                blur: 'sty/ped/blur.png',
                shadow: data.sty
            });
            Anims$1.zero(this.timers.walk);
            Anims$1.zero(this.timers.run);
            Util$1.UV.fromSheet(this.geometry, idleSquare, Peds$1.sheet);
        }
        change(remap) {
            this.data.remap = remap;
            this.data.sty = `sty/ped/template_${this.data.remap}.png`;
            //this.material.map = three.LoadTexture(this.data.sty);
        }
        update() {
            super.update();
            if (this.move) {
                Peds$1.play(this, this.run ? 'run' : 'walk');
                this.idle = false;
            }
            else if (!this.idle) {
                Anims$1.zero(this.timers.walk);
                Anims$1.zero(this.timers.run);
                Util$1.UV.fromSheet(this.geometry, idleSquare, Peds$1.sheet);
                this.idle = true;
            }
            //this.Gravitate();
            this.updatePosition();
        }
    }

    class Ply extends Ped {
        constructor(data) {
            super(data);
            console.log('ply');
            window.ply = this;
        }
        update() {
            //super.Update();
            const skooma = App.map[88]; // x
            if (App.map[16] == 1)
                this.run = !this.run;
            const A = App.map[65] && !App.map[68];
            const S = App.map[83] && !App.map[87];
            const W = App.map[87] && !App.map[83];
            const D = App.map[68] && !App.map[65];
            if (A || D) {
                const r = this.idle ? 50 : !this.run ? 55 : 60;
                this.data.r += A ? Math.PI / r : Math.PI / -r;
            }
            if (W || S) {
                const dist = !this.run ? 0.5 / 64 : 1.5 / 64;
                let speed = W ? -dist : dist / 2;
                if (skooma)
                    speed *= 2;
                this.data.x += speed * Math.sin(-this.data.r);
                this.data.y += speed * Math.cos(-this.data.r);
                Peds$1.play(this, this.run ? 'run' : 'walk');
                this.idle = false;
            }
            else if (!this.idle) {
                Anims$1.zero(this.timers.walk);
                Anims$1.zero(this.timers.run);
                Util$1.UV.fromSheet(this.geometry, { x: 1, y: 8 }, Peds$1.sheet);
                this.idle = true;
            }
            ////this.gravitate();
            this.updatePosition();
        }
    }

    // For making vertical ~> horizontal
    // So you only need to make one
    // vertical generator
    class StagingArea {
        constructor() {
            this.datas = [];
        }
        addData(data) {
            this.datas.push(data);
        }
        addDatas(datas) {
            this.datas = this.datas.concat(datas);
        }
        deliverAll() {
            for (let data of this.datas)
                Datas$1.replaceDeliver(data);
        }
        findExtents() {
            let set = false;
            for (let data of this.datas) {
                // aabb
                if (!set) {
                    this.min = [data.x, data.y, data.z];
                    this.max = [data.x, data.y, data.z];
                    set = true;
                }
                this.min[0] = Math.min(data.x, this.min[0]);
                this.min[1] = Math.min(data.y, this.min[1]);
                this.min[2] = Math.min(data.z, this.min[2]);
                this.max[0] = Math.max(data.x, this.max[0]);
                this.max[1] = Math.max(data.y, this.max[1]);
                this.max[2] = Math.max(data.z, this.max[2]);
            }
        }
        ccw(n) {
            this.findExtents();
            for (let y = 0; y < this.max[1]; y++) {
                for (let x = 0; x < this.min[0]; x++) {
                }
            }
            for (let data of this.datas) {
                let p = rotate(this.min[0], this.min[1], data.x, data.y, n * 90);
                //console.log('rotate is', p[0], p[1]);
                data.r += n;
                data.x = p[0];
                data.y = p[1] + (this.max[0] - this.min[0]);
            }
        }
    }
    function rotate(cx, cy, x, y, angle) {
        var radians = (Math.PI / 180) * angle, cos = Math.cos(radians), sin = Math.sin(radians), nx = (cos * (x - cx)) + (sin * (y - cy)) + cx, ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return [Math.round(nx), Math.round(ny)];
    }

    const parkedCarNames = [
        "Romero", "Wellard", "Aniston BD4",
        "Beamer",
        "Bug", "Bulwark", /*"Bus",*/ "Cop Car",
        "Minx", "Eddy", "Panto",
        "Shark", "GT-A1",
        /*"Hot Dog Van", "Ice-Cream Van", "Dementia Limousine",*/ "Dementia",
        "Land Roamer", "Jefferson",
        /*"Medicar",*/ "Benson", "Schmidt", "Miara",
        "Big Bug", "Morton", "Maurice", "Pickup",
        "A-Type", "Arachnid", "Spritzer", "Stinger",
        "Meteor", /*"Meteor Twoo?",*/ "Hachura", "B-Type",
        "Taxi Xpress", /*"SWAT Van",*/ "Michelli Roadster",
        "Taxi", "T-Rex",
        /*"Train", "Train Cab", "Train FB",*/ "Trance-Am",
        /*"Truck Cab", "Truck Cab SX", "Container", "Transporter",*/
        "TV Van", "Van", "U-Jerk Truck", "Z-Type",
        "Rumbler",
        "Jagular XK",
        "Furore GT", "Special Agent Car" /*, "Karma Bus",*/
    ];
    window.parkedCarNames = parkedCarNames;

    // PLURAL "LIKE A C API"
    var Cars;
    (function (Cars) {
        function GetRandomName() {
            let i = Math.floor(Math.random() * parkedCarNames.length);
            let name = parkedCarNames[i];
            console.log('GetRandomName ' + i + ' ' + name);
            return name;
        }
        Cars.GetRandomName = GetRandomName;
    })(Cars || (Cars = {}));
    var Cars$1 = Cars;

    var Gen1;
    (function (Gen1) {
        Gen1.roadMode = 'Normal';
        let Axis;
        (function (Axis) {
            Axis[Axis["Horz"] = 0] = "Horz";
            Axis[Axis["Vert"] = 1] = "Vert";
        })(Axis = Gen1.Axis || (Gen1.Axis = {}));
        function invert(data, axis, w) {
            let x = data.x;
            let y = data.y;
            data.x = axis ? y : x;
            data.y = axis ? x : y;
            data.r = axis;
            data.x += w[0];
            data.y += w[1];
        }
        Gen1.invert = invert;
        function loop(min, max, func) {
            let x = 0;
            for (; x < max[0]; x++) {
                let y = 0;
                for (; y < max[1]; y++) {
                    let z = 0;
                    for (; z < max[2]; z++) {
                        func([min[0] + x, min[1] + y, min[2] + z]);
                    }
                }
            }
        }
        Gen1.loop = loop;
        let GenFlats;
        (function (GenFlats) {
            GenFlats.blueMetal = [
                'sty/metal/blue/340.bmp',
                'sty/metal/blue/340.bmp',
                'sty/metal/blue/340.bmp',
                'sty/metal/blue/340.bmp',
                'sty/metal/blue/340.bmp'
            ];
            const roofFunc = (block, w, min, max) => {
                if (w[2] == max[2] - min[2] - 1) {
                    block.faces[4] = 'sty/roofs/green/793.bmp';
                    if (w[0] == min[0] && w[1] == min[1]) { // lb
                        block.faces[4] = 'sty/roofs/green/784.bmp';
                        block.r = 3;
                    }
                    else if (w[0] == min[0] + max[0] - 1 && w[1] == min[1] + max[1] - 1) { // rt
                        block.faces[4] = 'sty/roofs/green/784.bmp';
                        block.f = true;
                        block.r = 0;
                    }
                    else if (w[0] == min[0] && w[1] == min[1] + max[1] - 1) { // lt
                        block.faces[4] = 'sty/roofs/green/784.bmp';
                        block.r = 0;
                    }
                    else if (w[0] == min[0] + max[0] - 1 && w[1] == min[1]) { // rb
                        block.faces[4] = 'sty/roofs/green/784.bmp';
                        block.r = 2;
                    }
                    else if (w[0] == min[0]) {
                        block.faces[4] = 'sty/roofs/green/790.bmp';
                        block.r = 1;
                    }
                    else if (w[1] == min[1] + max[1] - 1) {
                        block.faces[4] = 'sty/roofs/green/790.bmp';
                        block.f = true;
                        block.r = 2;
                    }
                    else if (w[0] == min[0] + max[0] - 1) {
                        block.faces[4] = 'sty/roofs/green/790.bmp';
                        block.r = 3;
                    }
                    else if (w[1] == min[1]) {
                        block.faces[4] = 'sty/roofs/green/790.bmp';
                        block.r = 0;
                    }
                }
            };
            function type1(min, max) {
                const func = (w) => {
                    let bmp = 'sty/metal/blue/340.bmp';
                    let block = {
                        type: 'Block',
                        x: w[0],
                        y: w[1],
                        z: w[2]
                    };
                    block.faces = [];
                    if (w[0] > min[0] &&
                        w[0] < min[0] + max[0] - 1 &&
                        w[1] > min[1] &&
                        w[1] < min[1] + max[1] - 1 &&
                        w[2] < min[2] + max[2] - 1)
                        return;
                    roofFunc(block, w, min, max);
                    if (w[0] == min[0])
                        block.faces[1] = bmp;
                    if (w[1] == min[1] + max[1] - 1)
                        block.faces[2] = bmp;
                    if (w[0] == min[0] + max[0] - 1)
                        block.faces[0] = bmp;
                    if (w[1] == min[1])
                        block.faces[3] = bmp;
                    Datas$1.deliver(block);
                };
                Gen1.loop(min, max, func);
            }
            GenFlats.type1 = type1;
        })(GenFlats = Gen1.GenFlats || (Gen1.GenFlats = {}));
        let GenRoads;
        (function (GenRoads) {
            function oneway(axis, w, segs, sheet) {
                let staging = new StagingArea;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let road = {
                        type: 'Surface',
                        sheet: sheet,
                        square: 'single',
                        x: w[0],
                        y: seg + w[1],
                        z: w[2],
                        r: 3
                    };
                    road.adapt_sheet = Gen1.roadMode == 'Adapt';
                    if (!seg || seg == segs - 1) {
                        road.square = 'singleOpen';
                        if (!seg)
                            road.r += 1;
                        else if (seg == segs - 1)
                            road.r -= 1;
                    }
                    staging.addData(road);
                }
                if (axis == 0)
                    staging.ccw(1);
                staging.deliverAll();
            }
            GenRoads.oneway = oneway;
            function twolane(axis, w, segs, sheet) {
                let staging = new StagingArea;
                const lanes = 2;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let lane = 0;
                    for (; lane < lanes; lane++) {
                        let road = {
                            type: 'Surface',
                            sheet: sheet,
                            square: 'sideLine',
                            x: seg + w[0],
                            y: lane + w[1],
                            z: 0,
                            r: !lane ? 2 : 0
                        };
                        if (!seg || seg == segs - 1) {
                            road.square = 'convexLine';
                            road.adapt_sheet = Gen1.roadMode == 'Adapt';
                            if (!seg && lane ||
                                seg == segs - 1 && !lane)
                                road.r += 1;
                        }
                        else if (lane == lanes - 1 && seg == 1 ||
                            !lane && seg == segs - 2) {
                            road.square = 'sideStopLine'; // sideStopLine
                            road.f = true;
                        }
                        staging.addData(road);
                    }
                }
                if (axis == 1)
                    staging.ccw(1);
                staging.deliverAll();
            }
            GenRoads.twolane = twolane;
            function highway(axis, w, segs, lanes, sheet) {
                let staging = new StagingArea;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let lane = 0;
                    for (; lane < lanes; lane++) {
                        let road = {
                            type: 'Surface',
                            sheet: sheet,
                            square: 'sideLine',
                            x: lane + w[0],
                            y: seg + w[1],
                            z: 0,
                            r: !lane ? 3 : 1
                        };
                        if (lane > 0 && lane < lanes - 1)
                            road.square = 'middleTracks';
                        else if (!seg || seg == segs - 1) {
                            road.square = 'convexLine';
                            if (!seg && !lane ||
                                seg == segs - 1 && lane)
                                road.r += 1;
                        }
                        /*else if (lane == lanes - 1 && seg == 1 ||
                            !lane && seg == segs - 2) {
                            road.square = 'sideStopLine';
                        }*/
                        staging.addData(road);
                    }
                }
                if (axis == 0)
                    staging.ccw(1);
                staging.deliverAll();
            }
            GenRoads.highway = highway;
        })(GenRoads = Gen1.GenRoads || (Gen1.GenRoads = {}));
        let GenParking;
        (function (GenParking) {
            function onewayRight(w, segs, lanes, sheet) {
                let staging = new StagingArea;
                if (lanes < 2)
                    console.warn('onewayRightVert less than 2 lanes');
                let seg = 0;
                for (; seg < segs; seg++) {
                    let lane = 0;
                    for (; lane < lanes; lane++) {
                        let road = {
                            type: 'Surface',
                            sheet: sheet,
                            square: 'sideClear',
                            x: lane + w[0],
                            y: seg + w[1],
                            z: w[2],
                            r: !lane ? 3 : 1
                        };
                        let parkedCar = {
                            type: 'Car',
                            carName: Cars$1.GetRandomName(),
                            x: road.x,
                            y: road.y,
                            z: road.z
                        };
                        let parkHere = false;
                        if (!seg || seg == segs - 1) {
                            if (!lane) {
                                road.square = 'singleOpen';
                                road.adapt_sheet = Gen1.roadMode == 'Adapt';
                                if (!seg)
                                    road.r += 1;
                                else if (seg == segs - 1)
                                    road.r -= 1;
                            }
                            else {
                                //road.square = 'sideLine';
                                //road.r = !seg ? 0 : 2;
                                continue; // Skip
                            }
                        }
                        else if (seg == 1 || seg == segs - 2) {
                            if (!lane) {
                                road.square = 'customNotch';
                                road.r = 1;
                                if (seg == 1)
                                    road.f = true;
                            }
                            else if (lane == lanes - 1) {
                                road.square = 'corner';
                                road.r = seg == 1 ? 0 : 3;
                                if (seg != 1) {
                                    parkedCar.r = Math.PI / 4;
                                    parkedCar.x = road.x + .5;
                                    parkedCar.y = road.y - .11;
                                    parkHere = true;
                                }
                            }
                            else {
                                road.r = seg == 1 ? 2 : 0;
                            }
                        }
                        else if (lane) {
                            if (lane == lanes - 1) {
                                road.square = 'parkingSpot';
                                parkedCar.r = Math.PI / 4;
                                parkedCar.x = road.x + .5;
                                parkedCar.y = road.y - .11;
                                parkHere = true;
                            }
                            else
                                road.square = 'clear';
                        }
                        if (parkHere && Math.random() < .75)
                            staging.addData(parkedCar);
                        staging.addData(road);
                    }
                }
                staging.deliverAll();
            }
            GenParking.onewayRight = onewayRight;
            function leftBigHorz(w, segs, lanes, sheet) {
                let staging = new StagingArea;
                lanes = 4;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let lane = 0;
                    for (; lane < lanes; lane++) {
                        let road = {
                            type: 'Surface',
                            sheet: sheet,
                            square: 'sideLine',
                            x: seg + w[0],
                            y: lane + w[1],
                            z: w[2],
                            r: 1
                        };
                        let parkedCar = {
                            type: 'Car',
                            carName: Cars$1.GetRandomName(),
                            x: road.x,
                            y: road.y,
                            z: road.z
                        };
                        let parkHere = false;
                        if (!seg) {
                            road.adapt_sheet = Gen1.roadMode == 'Adapt';
                            if (lane == 1) {
                                road.square = 'convexLine';
                                road.r += 1;
                            }
                            else if (lane == 2) {
                                road.square = 'convexLine';
                            }
                            else {
                                continue;
                            }
                        }
                        else if (seg == 1) {
                            if (lane == 1) {
                                road.square = 'sideLine';
                                road.r += 1;
                            }
                            else if (lane == 2) {
                                road.square = 'sideLine';
                                road.r -= 1;
                            }
                            else {
                                continue;
                            }
                        }
                        else if (seg == 2) {
                            if (lane == 0) {
                                road.square = 'corner';
                                parkHere = true;
                                parkedCar.r = Math.PI / 4;
                                parkedCar.x = road.x + 0.5 + 0.6;
                                parkedCar.y = road.y + 0.5;
                            }
                            else if (lane == 1) {
                                road.square = 'convexLine';
                                road.r += 2;
                            }
                            else if (lane == 2) {
                                road.square = 'convexLine';
                                road.r -= 1;
                            }
                            else if (lane == 3) {
                                road.square = 'corner';
                                road.r += 1;
                                parkHere = true;
                                parkedCar.r = Math.PI - Math.PI / 4;
                                parkedCar.x = road.x + 0.5 + 0.6;
                                parkedCar.y = road.y + 0.5;
                            }
                        }
                        else if (seg == segs - 1) {
                            if (lane == 0) {
                                road.square = 'corner';
                                road.r -= 1;
                            }
                            else if (lane == 3) {
                                road.square = 'corner';
                                road.r += 2;
                            }
                            else {
                                road.square = 'sideClear';
                            }
                        }
                        else if (lane == 1 || lane == 2) {
                            road.square = 'clear';
                        }
                        else if (lane != 1) {
                            road.square = 'parkingSpot';
                            parkHere = true;
                            // Bottom
                            if (!lane) {
                                road.r += 1;
                                road.f = true;
                                parkedCar.r = Math.PI / 4;
                                parkedCar.x = road.x + 0.5 + 0.6;
                                parkedCar.y = road.y + 0.5;
                            }
                            // Top
                            else {
                                road.r -= 1;
                                parkedCar.r = Math.PI - Math.PI / 4;
                                parkedCar.x = road.x + 0.5 + 0.6;
                                parkedCar.y = road.y + 0.5;
                            }
                        }
                        if (parkHere && Math.random() > .5)
                            staging.addData(parkedCar);
                        staging.addData(road);
                    }
                }
                staging.deliverAll();
            }
            GenParking.leftBigHorz = leftBigHorz;
        })(GenParking = Gen1.GenParking || (Gen1.GenParking = {}));
    })(Gen1 || (Gen1 = {}));
    var Gen1$1 = Gen1;

    var Gen2;
    (function (Gen2) {
        // To swap tile at ply in console
        // ~ Deline__.edit([Math.floor(ply.data.x), Math.floor(ply.data.y), 0], 'sideDash')
        function getDataOfType(w, type) {
            let point = { x: w[0], y: w[1], z: w[2] };
            let chunk = Datas$1.getChunk(point);
            for (let data of chunk.datas) {
                if (data.type != type)
                    continue;
                if (Points$1.different(data, point))
                    continue;
                return data;
            }
        }
        Gen2.getDataOfType = getDataOfType;
        function swap(w, assign) {
            let point = { x: w[0], y: w[1] };
            let chunk = Datas$1.getChunk(point);
            for (let data of chunk.datas) {
                if ('Surface' != data.type)
                    continue;
                if (Points$1.different(data, point))
                    continue;
                Object.assign(data, assign);
                console.log('Deline Swap complete');
                // Rebuild idiom
                chunk.remove(data);
                chunk.add(data);
                break;
            }
        }
        Gen2.swap = swap;
        let GenPlaza;
        (function (GenPlaza) {
            function fill(w, width, height, sty = 'sty/floors/blue/256.bmp') {
                //const lanes = 1;
                let x = 0;
                for (; x < width; x++) {
                    let y = 0;
                    for (; y < height; y++) {
                        let pav = {
                            type: 'Surface',
                            //sheet: 'yellowyPavement',
                            //square: 'middle',
                            sty: sty,
                            x: x + w[0],
                            y: y + w[1],
                            z: w[2],
                        };
                        Datas$1.deliver(pav);
                    }
                }
            }
            GenPlaza.fill = fill;
        })(GenPlaza = Gen2.GenPlaza || (Gen2.GenPlaza = {}));
        let GenDeline;
        (function (GenDeline) {
            function simple(w, width, height) {
                let x = 0;
                for (; x < width; x++) {
                    let y = 0;
                    for (; y < height; y++) {
                        let point = { x: w[0] + x, y: w[1] + y };
                        let chunk = Datas$1.getChunk(point);
                        for (let data of chunk.datas) {
                            if ('Surface' != data.type)
                                continue;
                            if (Points$1.different(data, point))
                                continue;
                            if (data.square == 'sideLine') {
                                data.square = 'sideClear';
                            }
                            if (data.square == 'convexLine')
                                data.square = 'convex';
                            if (data.square == 'sideStopLine') {
                                data.square = 'sideStop';
                            }
                        }
                    }
                }
            }
            GenDeline.simple = simple;
            function horz(w, width, height) {
                let x = 0;
                for (; x < width; x++) {
                    let y = 0;
                    for (; y < height; y++) {
                        let point = { x: w[0] + x, y: w[1] + y };
                        let chunk = Datas$1.getChunk(point);
                        //if (chunked.includes(chunk))
                        //continue;
                        //chunked.push(chunk);
                        for (let data of chunk.datas) {
                            if ('Surface' != data.type)
                                continue;
                            if (Points$1.different(data, point))
                                continue;
                            if (data.square == 'sideLine') {
                                data.square = 'sideClear';
                                if (point.x == w[0] || point.x == w[0] + width - 1) {
                                    data.square = 'sideDash';
                                    if (point.x == w[0] + width - 1 && point.y == w[1])
                                        data.f = true;
                                    if (point.x == w[0] && point.y == w[1] + height - 1)
                                        data.f = true;
                                }
                            }
                            if (data.square == 'convexLine')
                                data.square = 'convex';
                            if (data.square == 'sideStopLine') {
                                data.square = 'sideStop';
                            }
                        }
                    }
                }
            }
            GenDeline.horz = horz;
            function mixedToBad(w, width, height) {
                let x = 0;
                for (; x < width; x++) {
                    let y = 0;
                    for (; y < height; y++) {
                        let point = { x: w[0] + x, y: w[1] + y };
                        let chunk = Datas$1.getChunk(point);
                        //if (chunked.includes(chunk))
                        //continue;
                        //chunked.push(chunk);
                        for (let data of chunk.datas) {
                            if ('Surface' != data.type)
                                continue;
                            if (Points$1.different(data, point))
                                continue;
                            if (Math.random() > .5)
                                continue;
                            if (data.sheet == 'mixedRoads' &&
                                data.square.indexOf('side') > -1) {
                                data.sheet = 'badRoads';
                                //if (Math.random() > .25)
                                //continue;
                                //if (data.square != 'sideDash')
                                //data.square = Math.random() > .5 ? 'sideDecal' : 'sideDecal_2';
                            }
                        }
                    }
                }
            }
            GenDeline.mixedToBad = mixedToBad;
            function EditMultiple(w, width, height, square_a, square_b) {
                let x = 0;
                for (; x < width; x++) {
                    let y = 0;
                    for (; y < height; y++) {
                        let point = { x: w[0] + x, y: w[1] + y };
                        let chunk = Datas$1.getChunk(point);
                        //if (chunked.includes(chunk))
                        //continue;
                        //chunked.push(chunk);
                        for (let data of chunk.datas) {
                            if ('Surface' != data.type)
                                continue;
                            if (Points$1.different(data, point))
                                continue;
                            if (data.square == 'sideLine')
                                data.square = 'sideClear';
                            else if (data.square == 'sideStopLine')
                                data.square = 'sideStop';
                        }
                    }
                }
            }
            GenDeline.EditMultiple = EditMultiple;
        })(GenDeline = Gen2.GenDeline || (Gen2.GenDeline = {}));
        let GenPavements;
        (function (GenPavements) {
            function fill(w, width, height) {
                //const lanes = 1;
                let x = 0;
                for (; x < width; x++) {
                    let y = 0;
                    for (; y < height; y++) {
                        let pav = {
                            type: 'Surface',
                            sheet: 'yellowyPavement',
                            square: 'middle',
                            //sty: 'sty/floors/blue/256.bmp',
                            x: x + w[0],
                            y: y + w[1],
                            z: w[2],
                        };
                        Datas$1.deliver(pav);
                    }
                }
            }
            GenPavements.fill = fill;
            function vert(x, y, z, segs, lanes) {
                //const lanes = 1;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let lane = 0;
                    for (; lane < lanes; lane++) {
                        let pav = {
                            type: 'Surface',
                            sheet: 'yellowyPavement',
                            square: 'middle',
                            //sty: 'sty/floors/blue/256.bmp',
                            x: lane + x,
                            y: seg + y,
                            z: 0
                        };
                        Datas$1.deliver(pav);
                    }
                }
            }
            GenPavements.vert = vert;
            function Horz(x, y, z, segs, lanes) {
                //const lanes = 1;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let lane = 0;
                    for (; lane < lanes; lane++) {
                        let pav = {
                            type: 'Surface',
                            sheet: 'yellowyPavement',
                            square: 'middle',
                            //sty: 'sty/floors/blue/256.bmp',
                            x: seg + y,
                            y: lane + x,
                            z: 0
                        };
                        Datas$1.deliver(pav);
                    }
                }
            }
            GenPavements.Horz = Horz;
        })(GenPavements = Gen2.GenPavements || (Gen2.GenPavements = {}));
    })(Gen2 || (Gen2 = {}));
    var Gen2$1 = Gen2;

    var GenLocations;
    (function (GenLocations) {
        function aptsOffice() {
            Gen1$1.roadMode = 'Adapt';
            // nature\tracks\514.bmp
            // nature/park original/216.bmp
            Gen2$1.GenPlaza.fill([-10, -500, 0], 1000, 1000, 'sty/nature/tracks/522.bmp');
            //Gen2.GenPavements.vert(-1, -50, 0, 100, 1);
            //Gen2.GenPavements.vert(3, -50, 0, 100, 1);
            //Gen2.GenPavements.vert(12, -50, 0, 100, 1);
            //Gen2.GenPavements.vert(9, -50, 0, 100, 1);
            //Gen1.GenRoads.highway(1, [0, -25, 0], 50, 3, 'badRoads');
            Gen1$1.GenRoads.twolane(1, [10, -25, 0], 50, 'greyRoads'); // Big main road
            //Gen1.GenFlats.type1([4, 7, 0], [6, 6, 1]); // Apts above
            Gen1$1.GenFlats.type1([2, 1, 0], [3, 4, 1]); // Gas station
            //Gen2.GenPavements.fill([4, 4, 0], 4, 1);
            // The roads around the office with parking
            Gen1$1.GenRoads.oneway(0, [6, 5, 0], 5, 'greyRoads'); // Parking exit
            Gen1$1.GenRoads.oneway(0, [6, 0, 0], 5, 'greyRoads'); // Parking exit
            Gen1$1.GenRoads.highway(1, [5, 0, 0], 6, 2, 'greyRoads'); // Pumps road
            //Gen1.GenRoads.twolane(0, [2, 5, 0], 9, 'greenRoads'); // horz
            //Gen1.GenRoads.twolane(0, [2, -2, 0], 9, 'greenRoads'); // horz
            //GenDeline.mixedToBad([2, 4, 0], 9, 4);
            //GenDeline.mixedToBad([2, -3, 0], 9, 4);
            Gen1$1.GenParking.onewayRight([8, 0, 0], 6, 2, 'badRoads');
            Gen2$1.GenDeline.horz([4, 0, 0], 6, 6);
            let gas_station_corner = Gen2$1.getDataOfType([8, 5, 0], 'Surface');
            let gas_station_corner2 = Gen2$1.getDataOfType([8, 0, 0], 'Surface');
            gas_station_corner.square = 'singleExit';
            gas_station_corner2.square = 'singleExit';
            //gas_station_corner2!.r! += 1;
            // Deline around the apts
            Gen2$1.GenDeline.horz([2, 4, 0], 9, 3);
            Gen2$1.GenDeline.horz([2, -1, 0], 9, 3);
            return;
        }
        GenLocations.aptsOffice = aptsOffice;
        function longLonesome() {
            Gen2$1.GenPlaza.fill([-10, -500, 0], 1000, 1000, 'sty/nature/park original/216.bmp');
            //GenPlaza.fill([9, -100, 0], 1, 200);
            //GenPlaza.fill([13, -100, 0], 1, 200);
            Gen1$1.GenRoads.highway(1, [10, -500, 0], 1000, 3, 'greenRoads');
            //GenRoads.twolane(1, [10, -25, 0], 50, 'badRoads'); // vert
        }
        GenLocations.longLonesome = longLonesome;
    })(GenLocations || (GenLocations = {}));
    var GenLocations$1 = GenLocations;

    var EasingFunctions;
    (function (EasingFunctions) {
        // no easing, no acceleration
        function linear(t) {
            return t;
        }
        EasingFunctions.linear = linear;
        // Accelerating from zero velocity
        function inQuad(t) {
            return t * t;
        }
        EasingFunctions.inQuad = inQuad;
        // Decelerating to zero velocity
        function easeOutQuad(t) {
            return t * (2 - t);
        }
        EasingFunctions.easeOutQuad = easeOutQuad;
        // Acceleration until halfway, then deceleration
        function inOutQuad(t) {
            return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
        EasingFunctions.inOutQuad = inOutQuad;
        // Accelerating from zero velocity 
        function inCubic(t) {
            return t * t * t;
        }
        EasingFunctions.inCubic = inCubic;
        // Decelerating to zero velocity 
        function outCubic(t) {
            return (--t) * t * t + 1;
        }
        EasingFunctions.outCubic = outCubic;
        // Acceleration until halfway, then deceleration 
        function inOutCubic(t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        EasingFunctions.inOutCubic = inOutCubic;
        // Accelerating from zero velocity 
        function inQuart(t) {
            return t * t * t * t;
        }
        EasingFunctions.inQuart = inQuart;
        // Decelerating to zero velocity 
        function outQuart(t) {
            return 1 - (--t) * t * t * t;
        }
        EasingFunctions.outQuart = outQuart;
        // Acceleration until halfway, then deceleration
        function inOutQuart(t) {
            return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
        }
        EasingFunctions.inOutQuart = inOutQuart;
        // Accelerating from zero velocity
        function inQuint(t) {
            return t * t * t * t * t;
        }
        EasingFunctions.inQuint = inQuint;
        // Decelerating to zero velocity
        function outQuint(t) {
            return 1 + (--t) * t * t * t * t;
        }
        EasingFunctions.outQuint = outQuint;
        // Acceleration until halfway, then deceleration 
        function inOutQuint(t) {
            return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
        }
        EasingFunctions.inOutQuint = inOutQuint;
    })(EasingFunctions || (EasingFunctions = {}));
    var EasingFunctions$1 = EasingFunctions;

    // todo construct a utility type from the length of the stages array,
    // so that we can make a cool tuple for the Zoom.Set so that we dont
    // have to write 0 | 1 | 2 | 3
    // http://www.typescriptlang.org/docs/handbook/advanced-types.html
    var Zoom;
    (function (Zoom) {
        Zoom.stage = 2;
        Zoom.stages = [150, 300, 600, 1200];
        let broom = 600;
        let zoom = 600;
        let t = 0;
        const SECONDS = 1;
        function set(st) {
            t = 0;
            broom = zoom;
            Zoom.stage = st;
        }
        Zoom.set = set;
        function update() {
            if (!KILL$1.ply)
                return;
            const z = App.map[90] == 1;
            if (z) {
                t = 0;
                broom = zoom;
                Zoom.stage =
                    Zoom.stage < Zoom.stages.length - 1 ? Zoom.stage + 1 : 0;
            }
            t += Four$1.delta / SECONDS;
            t = Math.min(Math.max(t, 0.0), 1.0);
            const difference = Zoom.stages[Zoom.stage] - broom;
            const T = EasingFunctions$1.inOutCubic(t);
            zoom = broom + (T * difference);
            const data = KILL$1.ply.data;
            Four$1.camera.position.set(data.x * 64, data.y * 64, zoom);
        }
        Zoom.update = update;
    })(Zoom || (Zoom = {}));
    var Zoom$1 = Zoom;

    const TWO = THREE__default;
    var Movie;
    (function (Movie) {
        Movie.enabled = true;
        function cityView() {
            Zoom$1.set(2);
            Movie.effect.uniforms["pixelSize"].value = 3.0;
            Movie.effect.uniforms["zoom"].value = 0.0;
        }
        Movie.cityView = cityView;
        function Resize() {
            Movie.effect.uniforms["resolution"].value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
        }
        Movie.Resize = Resize;
        function init() {
            Movie.composer = new TWO.EffectComposer(Four$1.renderer);
            Movie.renderPass = new TWO.RenderPass(Four$1.scene, Four$1.camera);
            Movie.composer.addPass(Movie.renderPass);
            Movie.effect = new TWO.ShaderPass(Movie.retroShader);
            Movie.effect.uniforms['redblue'].value = 0.0015 * 0.5;
            Movie.effect.uniforms["resolution"].value =
                new THREE.Vector2(window.innerWidth, window.innerHeight);
            Movie.effect.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
            Movie.effect.renderToScreen = true;
            Movie.composer.addPass(Movie.effect);
        }
        Movie.init = init;
        Movie.retroShader = {
            uniforms: {
                "tDiffuse": { value: null },
                "redblue": { value: 0.005 },
                "angle": { value: 0.0 },
                "resolution": { value: null },
                "pixelSize": { value: 1.0 },
                "zoom": { value: 1.0 }
            },
            defines: {
                'XXX': '',
            },
            vertexShader: `
            varying vec2 vUv;
            uniform float zoom;

            void main() {

                vUv = uv;

                //if (zoom > 0.0) {
                //    vUv.x -= zoom / 300.0;
                //}

                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

            }`,
            fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float redblue;
            uniform float angle;

            uniform float zoom;
            uniform float pixelSize;
            uniform vec2 resolution;

            varying vec2 vUv;

            float reduce(float p) {
                float DIVIDE = 4.0;
                return (ceil((p * 255.0) / DIVIDE) * DIVIDE) / 255.0;
                // ceil is lighter, floor is darker
            }

            vec4 R2D2(vec2 v) {
                vec4 rgb = texture2D(tDiffuse, v);
                rgb.r = reduce(rgb.r);
                rgb.g = reduce(rgb.g);
                rgb.b = reduce(rgb.b);
                return rgb;
            }

            void main() {

                // cinematic retro city view
                if (pixelSize > 1.0) {

                    vec2 dxy = pixelSize / resolution;
                    vec2 coord = dxy * floor( vUv / dxy );

                    vec2 uuu = coord; //coord; // vUv

                    vec2 offset = redblue * vec2( cos(angle), sin(angle));
                    vec4 cr = R2D2(uuu + offset);
                    vec4 cga = R2D2(uuu);
                    vec4 cb = R2D2(uuu - offset);

                    vec4 shifty = vec4(cr.r, cga.g, cb.b, cga.a);
                    gl_FragColor = shifty;

                    //gl_FragColor = R2D2(uuu);
                }
                else {
                    vec2 offset = redblue * vec2( cos(angle), sin(angle));
                    vec4 cr = texture2D(tDiffuse, vUv + offset);
                    vec4 cga = texture2D(tDiffuse, vUv);
                    vec4 cb = texture2D(tDiffuse, vUv - offset);

                    vec4 shifty = vec4(cr.r, cga.g, cb.b, cga.a);
                    gl_FragColor = shifty;
                    //gl_FragColor = texture2D(tDiffuse, vUv);

                }

                #ifdef MAKE_BLACK
                    
                    gl_FragColor.rgb *= 0.0;

                #endif
            }`
        };
    })(Movie || (Movie = {}));

    var KILL;
    (function (KILL) {
        function init() {
            console.log('gta init');
            Phong2$1.rig();
            Rectangles$1.init();
            Surfaces$1.init();
            Blocks$1.init();
            BoxCutter$1.init();
            Spritesheets$1.init();
            Movie.init();
            KILL.city = new City;
            window.KILL = KILL;
            //GenLocations.longLonesome();
            GenLocations$1.aptsOffice();
            let data = {
                type: 'Ply',
                x: 10.5,
                y: 1,
                z: 0
            };
            data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];
            KILL.ply = new Ply(data);
            KILL.city.chunkList.get2(0, 0);
            KILL.city.chunkList.get2(0, 1);
        }
        KILL.init = init;
        function update() {
            if (KILL.ply)
                KILL.ply.update();
            Zoom$1.update();
            KILL.city.update(KILL.ply.data);
        }
        KILL.update = update;
    })(KILL || (KILL = {}));
    var KILL$1 = KILL;

    //export { THREE };
    var Four;
    (function (Four) {
        Four.delta = 0;
        function update() {
            Four.delta = Four.clock.getDelta();
            KILL$1.update();
            if (Movie.enabled)
                Movie.composer.render();
            else
                Four.renderer.render(Four.scene, Four.camera);
        }
        Four.update = update;
        function init() {
            console.log('four init');
            Four.clock = new THREE.Clock();
            Four.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
            Four.camera.position.z = 200;
            Four.scene = new THREE.Scene();
            Four.directionalLight = new THREE.DirectionalLight(0x355886, 0.8);
            Four.directionalLight.position.set(0, 0, 1);
            Four.ambientLight = new THREE.AmbientLight('#355886'); // #5187cd
            Four.scene.add(Four.directionalLight);
            Four.scene.add(Four.directionalLight.target);
            Four.scene.add(Four.ambientLight);
            Four.renderer = new THREE.WebGLRenderer({ antialias: true });
            Four.renderer.setPixelRatio(window.devicePixelRatio);
            Four.renderer.setSize(window.innerWidth, window.innerHeight);
            Four.renderer.autoClear = true;
            //renderer.setClearColor(0x777777, 1);
            document.body.appendChild(Four.renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);
        }
        Four.init = init;
        function onWindowResize() {
            Four.camera.aspect = window.innerWidth / window.innerHeight;
            Four.camera.updateProjectionMatrix();
            Four.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    })(Four || (Four = {}));
    window['Four'] = Four;
    var Four$1 = Four;

    (function (App) {
        App.map = {};
        App.wheel = 0;
        App.move = [0, 0];
        App.left = false;
        function onkeys(event) {
            const key = event.keyCode;
            //console.log(event);
            if ('keydown' == event.type)
                App.map[key] = (undefined == App.map[key])
                    ? 1 /* PRESSED */
                    : 3 /* AGAIN */;
            else if ('keyup' == event.type)
                App.map[key] = 0 /* UP */;
            if (key == 114) // F3
                event.preventDefault();
            return;
        }
        function onwheel(event) {
            let up = event.deltaY < 0;
            App.wheel = up ? 1 : -1;
        }
        function onmove(event) {
            App.move[0] = event.clientX;
            App.move[1] = event.clientY;
        }
        function ondown(event) {
            if (event.button == 0)
                App.left = true;
        }
        function onup(event) {
            if (event.button == 0)
                App.left = false;
        }
        function boot() {
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmove;
            document.onmousedown = ondown;
            document.onmouseup = onup;
            document.onwheel = onwheel;
            Four$1.init();
            KILL$1.init();
            loop();
        }
        App.boot = boot;
        const delay = () => {
            for (let i in App.map) {
                if (1 /* PRESSED */ == App.map[i])
                    App.map[i] = 2 /* DELAY */;
                else if (0 /* UP */ == App.map[i])
                    delete App.map[i];
            }
        };
        const loop = (timestamp) => {
            requestAnimationFrame(loop);
            Four$1.update();
            App.wheel = 0;
            delay();
        };
    })(exports.App || (exports.App = {}));
    window['App'] = exports.App;
    var App = exports.App;

    exports.default = App;

    return exports;

}({}, THREE));
