var gta_kill = (function (exports, THREE) {
    'use strict';

    var THREE__default = 'default' in THREE ? THREE['default'] : THREE;

    var Points;
    (function (Points) {
        /*export interface Point {
            x: number;
            y: number;
        }*/
        function Make(x, y) {
            return { x: x, y: y };
        }
        Points.Make = Make;
        function Copy(src) {
            return { x: src.x, y: src.y };
        }
        Points.Copy = Copy;
        function Same(a, b) {
            return !Different(a, b);
        }
        Points.Same = Same;
        function Different(a, b) {
            return a.x - b.x || a.y - b.y;
        }
        Points.Different = Different;
        function Floor(a) {
            return Make(Math.floor(a.x), Math.floor(a.y));
        }
        Points.Floor = Floor;
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
            const d = Points$1.Make(Math.abs(p.x - chunk.w.x), Math.abs(p.y - chunk.w.y));
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
        function Init() {
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
                    //attribs.position.count -= 4;
                    //attribs.uv.count -= 4;
                    //attribs.normal.count -= 4;
                    geometry.groups.splice(i, 1);
                    // three.js has .addGroup
                    for (let j = 0; j < geometry.groups.length; j++) {
                        let group = geometry.groups[j];
                        if (j < i)
                            continue;
                        group.start -= 6;
                    }
                    //attribs.position.array = new Float32Array(position);
                    //attribs.uv.array = new Float32Array(uv);
                    //attribs.normal.array = new Float32Array(normal);
                }
            }
        }
        BoxCutter.Init = Init;
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
                UV.PlanarUV(geometry, 0, x, y, w, h);
            }
            UV.fromSheet = fromSheet;
            function PlanarUV(geom, face, x, y, w, h) {
                let o = face * 8;
                // 0 1, 1 1, 0 0, 1 0
                // left top, right top, left bottom, right bottom
                // [ x,y, x+w,y, x,y+h, x+w,y+h ]
                let a = [x, y + h, x + w, y + h, x, y, x + w, y];
                for (let i = 0; i < 8; i++) // coffee 0..7
                    geom.attributes.uv.array[o + i] = a[i];
                geom.attributes.uv.needsUpdate = true;
            }
            UV.PlanarUV = PlanarUV;
            function FlipPlane(geom, face, flip) {
                const o = face * 8;
                const a = geom.attributes.uv.array;
                const flips = [[a[o + 0], a[o + 1], a[o + 2], a[o + 3], a[o + 4], a[o + 5], a[o + 6], a[o + 7]],
                    [a[o + 2], a[o + 3], a[o + 0], a[o + 1], a[o + 6], a[o + 7], a[o + 4], a[o + 5]]];
                const yn = (flip) ? 1 : 0;
                for (let i = 0; i < 8; i++)
                    geom.attributes.uv.array[o + i] = flips[yn][i];
                geom.attributes.uv.needsUpdate = true;
            }
            UV.FlipPlane = FlipPlane;
            function RotatePlane(geom, face, turns) {
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
            UV.RotatePlane = RotatePlane;
            function RotateUVs(uvs, o, turns) {
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
            UV.RotateUVs = RotateUVs;
            function FlipUVs(uvs, o, flip) {
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
            UV.FlipUVs = FlipUVs;
        })(UV = Util.UV || (Util.UV = {}));
    })(Util || (Util = {}));
    var Util$1 = Util;

    var Blocks;
    (function (Blocks) {
        function Init() {
            Blocks.geometry = new THREE.BoxBufferGeometry(64, 64, 64);
            Util$1.UV.RotatePlane(Blocks.geometry, 0, 3);
            Util$1.UV.RotatePlane(Blocks.geometry, 1, 1);
            Util$1.UV.RotatePlane(Blocks.geometry, 2, 2);
        }
        Blocks.Init = Init;
        function GetBits(data) {
            let str = '';
            for (let i = 0; i < 5; i++)
                str += data.faces[i] ? '|' : 'O';
            str = str.toString().replace(/[\s,]/g, '');
            return str;
        }
        function GetBox(block) {
            let bits = GetBits(block);
            let box = BoxCutter$1.geometries[bits];
            return box.clone();
        }
        Blocks.GetBox = GetBox;
        function show(block) {
            four$1.scene.add(block.mesh);
        }
        Blocks.show = show;
        function Hide(block) {
            four$1.scene.remove(block.mesh);
        }
        Blocks.Hide = Hide;
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
                this.geometry = Blocks$1.GetBox(this.data);
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
                    Util$1.UV.FlipPlane(this.geometry, faceCount, true);
                if (this.data.r)
                    Util$1.UV.RotatePlane(this.geometry, faceCount, this.data.r);
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
        function Init() {
            this.geometry = new THREE__default.PlaneBufferGeometry(64, 64, 1, 1);
        }
        Surfaces.Init = Init;
        function Show(plane) {
            four$1.scene.add(plane.mesh);
        }
        Surfaces.Show = Show;
        function Hide(plane) {
            four$1.scene.remove(plane.mesh);
        }
        Surfaces.Hide = Hide;
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
        const sheets = {
            badRoads: {
                file: 'sty/sheets/bad_roads.png',
                squares: {
                    clear: { x: 1, y: 2 },
                    middleTracks: { x: 2, y: 2 },
                    middleCorner: { x: 3, y: 2 },
                    sideClear: { x: 1, y: 1 },
                    sideClear_alt: { x: 1, y: 1 },
                    sideLine: { x: 4, y: 1 },
                    sideDash: { x: 3, y: 1 },
                    sideStop: { x: 2, y: 4 },
                    sideStopLine: { x: 5, y: 1 },
                    sideStopDash: { x: 5, y: 2 },
                    single: { x: 1, y: 3 },
                    singleExit: { x: 2, y: 3 },
                    singleCorner: { x: 2, y: 3 },
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
                    singleCorner: { x: 2, y: 3 },
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
                    singleCorner: { x: 2, y: 3 },
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
                    singleCorner: { x: 2, y: 3 },
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
            this.Make();
        }
        // Override
        Destroy() {
            super.destroy();
            Surfaces$1.Hide(this);
            this.geometry.dispose();
            this.material.dispose();
            delete this.mesh;
            delete this.geometry;
            delete this.material;
        }
        Make() {
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
                Util$1.UV.FlipPlane(this.geometry, 0, true);
            if (this.data.r)
                Util$1.UV.RotatePlane(this.geometry, 0, this.data.r);
            Surfaces$1.Show(this);
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

    var Objects;
    (function (Objects) {
        function Factory(data) {
            switch (data.type) {
                //case 'Ped': return new Ped(data);
                //case 'Player': return new Player(data);
                //case 'Car': return new Car(data);
                case 'Block': return new Block(data);
                case 'Surface': return new Surface(data);
                //case 'Lamp': return new Lamp(data);
                default:
                    return null;
            }
        }
        function MakeNullable(data) {
            if (data.object2)
                console.warn('Data has object2');
            let object = Factory(data);
            if (!object)
                console.warn('Object2 not typable');
            data.object2 = object;
            return object || null;
        }
        Objects.MakeNullable = MakeNullable;
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
            let object = Objects$1.MakeNullable(data);
            if (!object)
                return;
            this.objects.push(object);
        }
        add(data) {
            this.datas.push(data);
            if (this.currentlyActive)
                this.fabricate(data);
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
            four$1.scene.add(this.group);
        }
        destroyRemove() {
            //console.log('Chunk destroy n remove');
            for (let object of this.objects)
                object.destroy();
            this.objects.length = 0; // Reset array
            this.currentlyActive = false;
            four$1.scene.remove(this.group);
        }
    }
    Chunk._tileSpan = 7; // use Chunks.tileSpan

    // Simple getters and chunk creation
    class ChunkList {
        constructor() {
            this.dict = {};
            window['test'] = 1;
        }
        GetNullable(w) {
            let z = `${w.x} & ${w.y}`;
            let chunk = this.dict[z];
            return chunk || null;
        }
        Get2(x, y) {
            return this.Get({ x: x, y: y });
        }
        Get(w) {
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
        function Big(data) {
            let w = Points$1.Make(Math.floor(data.x / Chunks$1.tileSpan), Math.floor(data.y / Chunks$1.tileSpan));
            return w;
        }
        Datas.Big = Big;
        function GetChunk(data) {
            let w = Big(data);
            let chunk = KILL$1.city.chunkList.Get(w);
            return chunk;
        }
        Datas.GetChunk = GetChunk;
        function Deliver(data) {
            let chunk = GetChunk(data);
            chunk.add(data);
        }
        Datas.Deliver = Deliver;
        function ReplaceDeliver(A) {
            let chunk = GetChunk(A);
            for (let B of chunk.datas) {
                if (B.type == 'Car')
                    continue;
                if (A.x == B.x &&
                    A.y == B.y &&
                    A.z == B.z)
                    chunk.remove(B);
            }
            chunk.add(A);
        }
        Datas.ReplaceDeliver = ReplaceDeliver;
        // for testing
        window.Datas__ = Datas;
    })(Datas || (Datas = {}));
    var Datas$1 = Datas;

    class City {
        constructor() {
            this.chunks = [];
            this.chunkList = new ChunkList;
            this.new = Points$1.Make(0, 0);
            this.old = Points$1.Make(100, 100);
        }
        update(p) {
            this.new = Datas$1.Big(p);
            if (Points$1.Same(this.new, this.old))
                return;
            console.log(`${this.old.x} & ${this.old.y} different to ${this.new.x} & ${this.new.y}`);
            this.old = Points$1.Copy(this.new);
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
                    let z = Points$1.Make(x - m + to.x, y - m + to.y);
                    let ch = this.chunkList.GetNullable(z);
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

    var KILL;
    (function (KILL) {
        function init() {
            console.log('gta init');
            KILL.city = new City;
        }
        KILL.init = init;
        function update() {
        }
        KILL.update = update;
    })(KILL || (KILL = {}));
    var KILL$1 = KILL;

    //export { THREE };
    var four;
    (function (four) {
        four.delta = 0;
        function render() {
            four.delta = four.clock.getDelta();
            KILL$1.update();
            //if (Movie.enabled) {
            //	Movie.composer.render();
            //}
            //else {
            four.renderer.clear();
            four.renderer.render(four.scene, four.camera);
            //}
        }
        four.render = render;
        function init() {
            console.log('four init');
            four.clock = new THREE.Clock();
            four.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
            four.camera.position.z = 200;
            four.scene = new THREE.Scene();
            four.directionalLight = new THREE.DirectionalLight(0x355886, 0.5);
            four.ambientLight = new THREE.AmbientLight('#355886'); // #5187cd
            four.scene.add(four.directionalLight);
            four.scene.add(four.ambientLight);
            four.renderer = new THREE.WebGLRenderer({ antialias: false });
            four.renderer.setPixelRatio(window.devicePixelRatio);
            four.renderer.setSize(window.innerWidth, window.innerHeight);
            four.renderer.autoClear = true;
            four.renderer.setClearColor(0x777777, 1);
            document.body.appendChild(four.renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);
        }
        four.init = init;
        function onWindowResize() {
            four.camera.aspect = window.innerWidth / window.innerHeight;
            four.camera.updateProjectionMatrix();
            four.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    })(four || (four = {}));
    var four$1 = four;

    (function (app) {
        app.map = {};
        app.wheel = 0;
        app.move = [0, 0];
        app.left = false;
        function onkeys(event) {
            const key = event.key;
            //console.log(event);
            if ('keydown' == event.type)
                app.map[key] = (undefined == app.map[key])
                    ? 1 /* PRESSED */
                    : 3 /* AGAIN */;
            else if ('keyup' == event.type)
                app.map[key] = 0 /* UP */;
            if (key == 114) // f3
                event.preventDefault();
            return;
        }
        function onwheel(event) {
            let up = event.deltaY < 0;
            app.wheel = up ? 1 : -1;
        }
        function onmove(event) {
            app.move[0] = event.clientX;
            app.move[1] = event.clientY;
        }
        function ondown(event) {
            if (event.button == 0)
                app.left = true;
        }
        function onup(event) {
            if (event.button == 0)
                app.left = false;
        }
        function boot() {
            document.onkeydown = document.onkeyup = onkeys;
            document.onmousemove = onmove;
            document.onmousedown = ondown;
            document.onmouseup = onup;
            document.onwheel = onwheel;
            four$1.init();
            KILL$1.init();
            loop();
        }
        app.boot = boot;
        const delay = () => {
            for (let i in app.map) {
                if (1 /* PRESSED */ == app.map[i])
                    app.map[i] = 2 /* DELAY */;
                else if (0 /* UP */ == app.map[i])
                    delete app.map[i];
            }
        };
        const loop = (timestamp) => {
            requestAnimationFrame(loop);
            KILL$1.update();
            four$1.render();
            app.wheel = 0;
            delay();
        };
    })(exports.app || (exports.app = {}));
    window['app'] = exports.app;
    var app = exports.app;

    exports.default = app;

    return exports;

}({}, THREE));
