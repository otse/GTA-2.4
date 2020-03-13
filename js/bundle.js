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
        function string(a) {
            return `${a.x},${a.y}`;
        }
        Points.string = string;
        function multp(a, n) {
            let b = copy(a);
            return make(b.x * n, b.y * n);
        }
        Points.multp = multp;
        function region(a, n) {
            return floor2(a.x / n, a.y / n);
        }
        Points.region = region;
        function dist(a, b) {
            const dx = a.x - b.x, dy = a.y - b.y;
            return dx * dx + dy * dy;
        }
        Points.dist = dist;
    })(Points || (Points = {}));
    var Points$1 = Points;

    var Chunks;
    (function (Chunks) {
        Chunks.tileSpan = 7;
        Chunks.actualSize = Chunks.tileSpan * 64;
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
            if (!data.flip)
                data.flip = false;
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
        function loadTexture(path, salt = '') {
            let pepper = path + salt;
            if (mem[pepper])
                return mem[pepper];
            let texture = new THREE.TextureLoader().load(path);
            texture.generateMipmaps = false;
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            mem[pepper] = texture;
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
                // pixel correction
                //x += .5 / sheet.width;
                //y += .5 / sheet.height;
                //w -= .5 / sheet.width;
                //h -= .5 / sheet.height;
                UV.planarUV(geometry, 0, x, y, w, h);
                return [x, y, w, h];
            }
            UV.fromSheet = fromSheet;
            // broken
            function pixelCorrection(geom, face, zxcv, halfPixel) {
                zxcv[0] += halfPixel;
                zxcv[1] += halfPixel;
                zxcv[2] -= halfPixel;
                zxcv[3] -= halfPixel;
                planarUV(geom, face, zxcv[0], zxcv[1], zxcv[2], zxcv[3]);
            }
            UV.pixelCorrection = pixelCorrection;
            function planarUV(geom, face, x, y, w, h) {
                let o = face * 8;
                let a = [x, y + h, x + w, y + h, x, y, x + w, y];
                for (let i = 0; i < 8; i++)
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
                if (this.data.flip)
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

    var Sheets;
    (function (Sheets) {
        const sheets = {};
        function get(name) {
            return sheets[name];
        }
        Sheets.get = get;
        function put(name, object) {
            sheets[name] = object;
        }
        Sheets.put = put;
        function clone(target, source) {
            let clone = JSON.parse(JSON.stringify(target));
            Object.assign(clone, source);
            return clone;
        }
        Sheets.clone = clone;
        function init() {
            Sheets.canvas = document.createElement('canvas');
            document.body.appendChild(Sheets.canvas);
            console.log('sheets init');
            let baseRoads = {
                width: 320,
                height: 320,
                piece: { w: 64, h: 64 }
            };
            let basePavement = {
                width: 256,
                height: 256,
                piece: { w: 64, h: 64 }
            };
            put('badRoads', clone(baseRoads, { file: 'sty/sheets/bad_roads.png' }));
            put('greenRoads', clone(baseRoads, { file: 'sty/sheets/green_roads.png' }));
            put('blueRoads', clone(baseRoads, { file: 'sty/sheets/blue_roads.bmp' }));
            put('qualityRoads', clone(baseRoads, { file: 'sty/sheets/quality_roads.bmp' }));
            put('mixedRoads', clone(baseRoads, { file: 'sty/sheets/mixed_roads.png' }));
            put('greyRoads', clone(baseRoads, { file: 'sty/sheets/grey_roads.png' }));
            put('greyRoadsMixed', clone(baseRoads, { file: 'sty/sheets/grey_roads_mixed.png' }));
            put('yellowyPavement', clone(basePavement, { file: 'sty/sheets/yellowy_pavement.png' }));
            put('greenPavement', clone(basePavement, { file: 'sty/sheets/green_pavement.png' }));
            KILL$1.resourced('SPRITES');
        }
        Sheets.init = init;
        var spriteTextures = [];
        // Cut sprite from sheet
        function cut(sheet, sprite) {
            // 
            const key = `sh ${sheet} sp ${Points$1.string(sprite)}`;
            if (spriteTextures[key])
                return spriteTextures[key];
            let canvasTexture = new THREE.CanvasTexture(Sheets.canvas);
            canvasTexture.magFilter = THREE.NearestFilter;
            canvasTexture.minFilter = THREE.NearestFilter;
            spriteTextures[key] = canvasTexture;
            let callback = (texture) => {
                const context = Sheets.canvas.getContext("2d");
                Sheets.canvas.width = sheet.piece.w;
                Sheets.canvas.height = sheet.piece.h;
                context.drawImage(texture.image, (sprite.x - 1) * -sheet.piece.w, (sprite.y - 1) * -sheet.piece.h);
                let image = new Image();
                image.src = Sheets.canvas.toDataURL();
                canvasTexture.image = image;
                canvasTexture.needsUpdate = true;
            };
            // optimize re-loading here
            let fakeTexture = new THREE.TextureLoader().load(sheet.file, callback, undefined, undefined);
            return canvasTexture;
        }
        Sheets.cut = cut;
        function center(path) {
            let canvasTexture = new THREE.CanvasTexture(Sheets.canvas);
            let callback = (texture) => {
                console.log('callback');
                const context = Sheets.canvas.getContext("2d");
                Sheets.canvas.width = texture.image.width;
                Sheets.canvas.height = texture.image.height;
                context.drawImage(texture.image, 0, 0);
                let imgData = context.getImageData(0, 0, Sheets.canvas.width, Sheets.canvas.height);
                const pixels = imgData.data;
                for (let y = 0; y < Sheets.canvas.height; y++) {
                    for (let x = 0; x < Sheets.canvas.width; x++) {
                        break;
                    }
                    break;
                }
                //let ox = Math.ceil((T - bmp.width) / 2) + 1;
                //let oy = Math.ceil((T - bmp.height) / 2) + 1;
                context.putImageData(imgData, 0, 0);
                // Now
                let image = new Image();
                image.src = Sheets.canvas.toDataURL();
                canvasTexture.image = image;
                canvasTexture.needsUpdate = true;
            };
            let fakeTexture = new THREE.TextureLoader().load(path, callback, undefined, undefined);
            return canvasTexture;
        }
        Sheets.center = center;
    })(Sheets || (Sheets = {}));
    var Sheets$1 = Sheets;

    var Water;
    (function (Water) {
        let time = 0;
        let i = 0;
        let waters = [];
        function init() {
            for (let i = 1; i <= 12; i++)
                waters.push(Util$1.loadTexture(`sty/special/water/${i}.bmp`));
            Water.material = new THREE.MeshPhongMaterial({
                map: waters[0]
            });
        }
        Water.init = init;
        function update() {
            time += Four$1.delta;
            if (time >= 0.11) {
                i += i < 11 ? 1 : -11;
                Water.material.map = waters[i];
                time = 0;
            }
        }
        Water.update = update;
    })(Water || (Water = {}));
    var Water$1 = Water;

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
            const hasSheet = this.data.sheet && this.data.sprite;
            let map;
            //let halfPixel = 0;
            if (hasSheet) {
                let sheet = Sheets$1.get(this.data.sheet);
                {
                    map = Sheets$1.cut(sheet, this.data.sprite);
                }
            }
            else {
                map = Util$1.loadTexture(this.data.sty);
            }
            //this.data.color = '#888888';
            this.material = new THREE.MeshPhongMaterial({
                map: map,
                shininess: 0,
                color: new THREE.Color(this.data.color),
            });
            let material = this.material;
            if ('sty/special/water/1.bmp' == this.data.sty) {
                material = Water$1.material;
            }
            //map.offset.set(.01, .01);
            this.mesh = new THREE.Mesh(this.geometry, material);
            this.mesh.matrixAutoUpdate = false;
            this.mesh.frustumCulled = false;
            this.mesh.castShadow = false;
            this.mesh.receiveShadow = true;
            this.mesh.position.set(this.data.x * 64 + 32, this.data.y * 64 + 32, this.data.z * 64);
            this.mesh.updateMatrix();
            if (this.data.flip)
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

    class Wall extends Object2 {
        constructor(data) {
            super(data);
            console.log('Wall');
            this.make();
        }
        destroy() {
            super.destroy();
        }
        make() {
            this.geometry = new THREE__default.PlaneBufferGeometry(64, 64, 1, 1);
            let style = `sty/interiors/${this.data.style}`;
            let sty, mask;
            if ('concave' == this.data.wall) {
                sty = `concave.bmp`;
                mask = `concaveMask.bmp`;
            }
            else {
                sty = `side.bmp`;
                mask = `sideMask.bmp`;
            }
            let map = Util$1.loadTexture(`${style}/${sty}`);
            let maskMap = Util$1.loadTexture(`${style}/${mask}`);
            this.material = new THREE.MeshPhongMaterial({
                map: map,
                shininess: 0,
                transparent: true,
                color: new THREE.Color(this.data.color),
            });
            this.material.onBeforeCompile = function (shader) {
                shader.uniforms.maskMap = { value: maskMap };
                shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `
                #define PHONG
                
				#define INTERIOR_WALL
				
				uniform sampler2D maskMap;
			`);
                // https://github.com/mrdoob/three.js/tree/dev/src/renderers/shaders/ShaderChunk/map_fragment.glsl.js
                shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
				#ifdef USE_MAP
				
                    vec4 texelColor = texture2D( map, vUv );
                    vec4 maskColor = texture2D( maskMap, vUv );
                    
                    texelColor.rgb *= maskColor.r;

					texelColor = mapTexelToLinear( texelColor );
					diffuseColor *= texelColor;

				#endif
			`);
            };
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.matrixAutoUpdate = false;
            this.mesh.frustumCulled = false;
            this.mesh.position.set(this.data.x * 64 + 32, this.data.y * 64 + 32, this.data.z * 64);
            this.mesh.updateMatrix();
            if (this.data.flip)
                Util$1.UV.flipPlane(this.geometry, 0, true);
            if (this.data.r)
                Util$1.UV.rotatePlane(this.geometry, 0, this.data.r);
            Four$1.scene.add(this.mesh);
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
            Four$1.scene.add(rectangle.meshShadow);
            Four$1.scene.add(rectangle.mesh);
        }
        Rectangles.show = show;
        function hide(rectangle) {
            Four$1.scene.remove(rectangle.meshShadow);
            Four$1.scene.remove(rectangle.mesh);
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
        function makeRectangle(phongProperties, p) {
            let customMaterial = new THREE.MeshPhongMaterial(phongProperties);
            customMaterial.onBeforeCompile = function (shader) {
                shader.uniforms.blurMap = { value: p.blurMap };
                shader.uniforms.pink = { value: new THREE.Vector3(1, 0, 1) };
                shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `
				#define PHONG
				#define PHONG2
				
				uniform sampler2D blurMap;
			`);
                shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
				#ifdef USE_MAP
				
					vec4 texelColor = vec4(0);
					
					vec4 mapColor = texture2D( map, vUv );

					//#ifdef PINK

					// Pink
					if ( mapColor.rgb == vec3(1, 0, 1) ) {
						mapColor.a = 0.0;
						mapColor.rgb *= 0.0;
					}

					// Blur
					vec4 blurColor = texture2D( blurMap, vUv );
					blurColor.rgb *= 0.0;
					blurColor.a /= 3.0; // detensify
					//texelColor = blurColor + mapColor;
					texelColor = mapColor;

					texelColor = mapTexelToLinear( texelColor );

					diffuseColor *= texelColor;

				#endif
			`);
            };
            return customMaterial;
        }
        Phong2.makeRectangle = makeRectangle;
        function makeRectangleShadow(phongProperties, p) {
            let customMaterial = new THREE.MeshPhongMaterial(phongProperties);
            customMaterial.onBeforeCompile = (shader) => {
                shader.uniforms.pink = { value: new THREE.Vector3(1, 0, 1) };
                shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `
				#define PHONG
				#define PHONG2

				// add uniforms here
			`);
                shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, `
				#ifdef USE_MAP
				
					vec4 texelColor = vec4(0);
					
					vec4 mapColor = texture2D( map, vUv );

					// Pink
					if ( mapColor.rgb == vec3(1, 0, 1) ) {
						mapColor.a = 0.0;
						mapColor.rgb *= 0.0;
					}

					texelColor = mapColor;

					texelColor = mapTexelToLinear( texelColor );

					diffuseColor *= texelColor;

				#endif
			`);
            }; // onBeforeCompile
            return customMaterial;
        }
        Phong2.makeRectangleShadow = makeRectangleShadow;
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
            //blurMap.minFilter = LinearFilter;
            //blurMap.magFilter = LinearFilter;
            let shadowMap = Util$1.loadTexture(info.blur);
            this.geometry = new THREE.PlaneBufferGeometry(this.data.width, this.data.height, 1);
            this.material = Phong2$1.makeRectangle({
                name: 'Phong2',
                transparent: true,
                map: map,
                blending: THREE__default.NormalBlending
            }, {
                blurMap: blurMap
            });
            let materialShadow = Phong2$1.makeRectangleShadow({
                name: 'Phong2 Shadow',
                transparent: true,
                map: blurMap,
            }, {});
            materialShadow.opacity = 0.25;
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
    const carNames = [
        "Romero", "Wellard", "Aniston BD4", "Pacifier",
        "G4 Bank Van", "Beamer", "Box Car", "Box Truck",
        "Bug", "Bulwark", "Bus", "Cop Car",
        "Minx", "Eddy", "Panto", "Fire Truck",
        "Shark", "GT-A1", "Garbage Truck", "Armed Land Roamer",
        "Hot Dog Van", "Ice-Cream Van", "Dementia Limousine", "Dementia",
        "Land Roamer", "Jefferson", "Stretch Limousine", "Sports Limousine",
        "Medicar", "Benson", "Schmidt", "Miara",
        "Big Bug", "Morton", "Maurice", "Pickup",
        "A-Type", "Arachnid", "Spritzer", "Stinger",
        "Meteor", /*"Meteor Twoo?",*/ "Hachura", "B-Type",
        "Taxi Xpress", "SWAT Van", "Michelli Roadster",
        "Taxi", "T-Rex", "Tow Truck",
        /*"Train", "Train Cab", "Train FB",*/ "Trance-Am",
        "Truck Cab", "Truck Cab SX", "Container", "Transporter",
        "TV Van", "Van", "U-Jerk Truck", "Z-Type",
        "Rumbler",
        "Jagular XK",
        "Furore GT", "Special Agent Car",
    ];

    var Cars;
    (function (Cars) {
        var cars;
        function init() {
            cars = [];
        }
        Cars.init = init;
        function getArray() {
            return cars;
        }
        Cars.getArray = getArray;
        function add(car) {
            cars.push(car);
        }
        Cars.add = add;
        function remove(car) {
            cars.splice(cars.indexOf(car), 1);
        }
        Cars.remove = remove;
        function getPaint(car) {
            return '';
        }
        Cars.getPaint = getPaint;
        function GetRandomName() {
            let i = Math.floor(Math.random() * parkedCarNames.length);
            let name = parkedCarNames[i];
            console.log('GetRandomName ' + i + ' ' + name);
            return name;
        }
        Cars.GetRandomName = GetRandomName;
    })(Cars || (Cars = {}));
    var Cars$1 = Cars;

    class Car extends Rectangle {
        constructor(data) {
            super(data);
            Cars$1.add(this);
            if (undefined == data.car)
                console.warn('Car data has no .car!');
            if (undefined == data.paint)
                data.paint = Math.floor(Math.random() * 35);
            //console.log('Car ' + data.car + ' paint ', data.paint);
            this.lift = 1;
            const meta = CarMetas.getNullable(data.car);
            const physics = CarPhysics$1.getNullable(data.car);
            const model = physics.model_corrected || physics.model;
            if (meta.COLORLESS)
                data.sty = `sty/car/unpainted/GTA2_CAR_${model}X.bmp`;
            else
                data.sty = `sty/car/painted/GTA2_CAR_${model}_PAL_${data.paint}.bmp`;
            data.width = meta.IMG_WIDTH;
            data.height = meta.IMG_HEIGHT;
            this.makeRectangle({
                blur: `sty/car/blurs/GTA2_CAR_${model}.png`,
                shadow: data.sty
            });
        }
        destroy() {
            super.destroy();
            Cars$1.remove(this);
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
                case 'Wall': return new Wall(data);
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
            let w = Points$1.floor2(data.x / Chunks$1.tileSpan, data.y / Chunks$1.tileSpan);
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
            Util$1.UV.fromSheet(ped.geometry, square || timer.def.spriteArray[timer.i], Peds.sheet);
            return timer;
        }
        Peds.play = play;
        Peds.sheet = {
            file: 'ped/template_24.png',
            width: 264,
            height: 759,
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
        walk: { frames: 8, moment: .11, spriteArray: walkSquares },
        run: { frames: 8, moment: .08, spriteArray: runSquares },
        scratch: { frames: 12, moment: .16, spriteArray: scratchSquares },
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

    var Sprites;
    (function (Sprites) {
        function sprite(a, b) {
            return { x: a, y: b };
        }
        Sprites.sprite = sprite;
        Sprites.ROADS = {
            CLEAR: sprite(1, 2),
            MIDDLE_TRACKS: sprite(2, 2),
            MIDDLE_CORNER: sprite(3, 2),
            SIDE_CLEAR: sprite(1, 1),
            SIDE_CLEAR_ALT: sprite(1, 1),
            SIDE_LINE: sprite(4, 1),
            SIDE_DASH: sprite(3, 1),
            SIDE_STOP: sprite(2, 4),
            SIDE_STOP_LINE: sprite(5, 1),
            SIDE_STOP_DASH: sprite(5, 2),
            PARKING_SPOT: sprite(1, 4),
            CUSTOM_NOTCH: sprite(3, 4),
            SINGLE: sprite(1, 3),
            SINGLE_EXIT: sprite(2, 3),
            SINGLE_CORNER: sprite(3, 3),
            SINGLE_OPEN: sprite(3, 5),
            CORNER: sprite(4, 3),
            CONVEX: sprite(4, 5),
            CONVEX_LINE: sprite(5, 5),
            SIDE_DECAL: sprite(1, 5),
            SIDE_DECAL_2: sprite(2, 5)
        };
        Sprites.PAVEMENTS = {
            MIDDLE: sprite(1, 1),
            SIDE_SHADOWED: sprite(2, 1),
            SIDE_PAVED: sprite(3, 1),
            SIDE_PAVED_SHADOWED: sprite(4, 1),
            SIDE_PAVED_SHADOWED_VENT: sprite(3, 3),
            SIDE_LINE_END: sprite(3, 1)
        };
        function init() {
            console.log('sprites init');
        }
        Sprites.init = init;
    })(Sprites || (Sprites = {}));
    var Sprites$1 = Sprites;

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
            Movie.effect.uniforms["pixelSize"].value = 1.0;
            Movie.effect.uniforms["zoom"].value = 0.0;
        }
        Movie.cityView = cityView;
        function cart(a, n) {
            if (a < Math.PI * 2)
                a += n * Four$1.delta;
            if (a > Math.PI * 2)
                a -= Math.PI * 2;
            return a;
        }
        let strawberry = 0;
        let orange = 0;
        let meat = 0;
        function update() {
            //updateHyper();
            //return;
            strawberry = cart(strawberry, 0.9);
            orange = cart(orange, 1.5);
            meat = cart(meat, 0.4);
            // sin = -1 - 1
            let x = Math.sin(strawberry);
            let y = Math.cos(orange) / 2;
            let z = Math.sin(meat) + 1 / 4; // 
            Movie.effect.uniforms['angle'].value = x * strawberry;
            Movie.effect.uniforms['redblue'].value = y * z * 0.0045;
        }
        Movie.update = update;
        let bat = 0;
        function updateHyper() {
            bat = cart(bat, 5);
            Movie.effect.uniforms['angle'].value = bat;
            Movie.effect.uniforms['redblue'].value = bat * 0.5;
        }
        Movie.updateHyper = updateHyper;
        function resize() {
            Movie.effect.uniforms["resolution"].value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
        }
        Movie.resize = resize;
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
                "pixelSize": { value: 3.0 },
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
				float DIVIDE = 8.0;
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
				/*if (pixelSize > 1.0) {

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
				else */
				{
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
        deliverReplace() {
            for (let data of this.datas)
                Datas$1.replaceDeliver(data);
        }
        deliverKeep() {
            for (let data of this.datas)
                Datas$1.deliver(data);
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

    var Generators;
    (function (Generators) {
        Generators.roadMode = 'Normal';
        let Axis;
        (function (Axis) {
            Axis[Axis["Horz"] = 0] = "Horz";
            Axis[Axis["Vert"] = 1] = "Vert";
        })(Axis = Generators.Axis || (Generators.Axis = {}));
        function invert(data, axis, w) {
            let x = data.x;
            let y = data.y;
            data.x = axis ? y : x;
            data.y = axis ? x : y;
            data.r = axis;
            data.x += w[0];
            data.y += w[1];
        }
        Generators.invert = invert;
        function loop(min, max, func) {
            let x = min[0];
            for (; x <= max[0]; x++) {
                let y = min[1];
                for (; y <= max[1]; y++) {
                    let z = min[2];
                    for (; z <= max[2]; z++) {
                        func([x, y, z]);
                    }
                }
            }
        }
        Generators.loop = loop;
        let Interiors;
        (function (Interiors) {
            function generate(min, max, style) {
                let staging = new StagingArea;
                const func = (p) => {
                    if (p[0] > min[0] &&
                        p[0] < max[0] &&
                        p[1] > min[1] &&
                        p[1] < max[1]) ;
                    else {
                        let wall = {
                            type: 'Wall',
                            style: style,
                            x: p[0],
                            y: p[1],
                            z: p[2]
                        };
                        wallFunc(wall, p, min, max);
                        staging.addData(wall);
                    }
                };
                Generators.loop(min, max, func);
                staging.deliverKeep();
            }
            Interiors.generate = generate;
            const wallFunc = (data, p, min, max) => {
                if (p[0] == min[0] && p[1] == min[1]) { // lb
                    data.wall = 'concave';
                    data.r = 3;
                }
                else if (p[0] == max[0] && p[1] == max[1]) { // rt
                    data.wall = 'concave';
                    data.flip = true;
                    data.r = 0;
                }
                else if (p[0] == min[0] && p[1] == max[1]) { // lt
                    data.wall = 'concave';
                    data.r = 0;
                }
                else if (p[0] == max[0] && p[1] == min[1]) { // rb
                    data.wall = 'concave';
                    data.r = 2;
                }
                else if (p[0] == min[0]) {
                    data.wall = 'side';
                    data.r = 3;
                }
                else if (p[1] == max[1]) {
                    data.wall = 'side';
                    data.flip = true;
                    data.r = 0;
                }
                else if (p[0] == max[0]) {
                    data.wall = 'side';
                    data.r = 1;
                }
                else if (p[1] == min[1]) {
                    data.wall = 'side';
                    data.r = 2;
                }
            };
        })(Interiors = Generators.Interiors || (Generators.Interiors = {}));
        let Buildings;
        (function (Buildings) {
            Buildings.blueMetal = [
                'sty/metal/blue/340.bmp',
                'sty/metal/blue/340.bmp',
                'sty/metal/blue/340.bmp',
                'sty/metal/blue/340.bmp',
                'sty/metal/blue/340.bmp'
            ];
            const roofFunc = (block, p, min, max) => {
                if (p[2] == max[2]) {
                    block.faces[4] = 'sty/roofs/green/793.bmp';
                    if (p[0] == min[0] && p[1] == min[1]) { // lb
                        block.faces[4] = 'sty/roofs/green/784.bmp';
                        block.r = 3;
                    }
                    else if (p[0] == max[0] && p[1] == max[1]) { // rt
                        block.faces[4] = 'sty/roofs/green/784.bmp';
                        block.flip = true;
                        block.r = 0;
                    }
                    else if (p[0] == min[0] && p[1] == max[1]) { // lt
                        block.faces[4] = 'sty/roofs/green/784.bmp';
                        block.r = 0;
                    }
                    else if (p[0] == max[0] && p[1] == min[1]) { // rb
                        block.faces[4] = 'sty/roofs/green/784.bmp';
                        block.r = 2;
                    }
                    else if (p[0] == min[0]) {
                        block.faces[4] = 'sty/roofs/green/790.bmp';
                        block.r = 1;
                    }
                    else if (p[1] == max[1]) {
                        block.faces[4] = 'sty/roofs/green/790.bmp';
                        block.flip = true;
                        block.r = 2;
                    }
                    else if (p[0] == max[0]) {
                        block.faces[4] = 'sty/roofs/green/790.bmp';
                        block.r = 3;
                    }
                    else if (p[1] == min[1]) {
                        block.faces[4] = 'sty/roofs/green/790.bmp';
                        block.r = 0;
                    }
                }
            };
            function type1(min, max) {
                const func = (p) => {
                    let bmp = 'sty/metal/blue/340.bmp';
                    let block = {
                        type: 'Block',
                        x: p[0],
                        y: p[1],
                        z: p[2]
                    };
                    block.faces = [];
                    if (p[0] > min[0] &&
                        p[0] < max[0] &&
                        p[1] > min[1] &&
                        p[1] < max[1] &&
                        p[2] < max[2])
                        return;
                    roofFunc(block, p, min, max);
                    if (p[0] == min[0])
                        block.faces[1] = bmp;
                    if (p[1] == max[1])
                        block.faces[2] = bmp;
                    if (p[0] == max[0])
                        block.faces[0] = bmp;
                    if (p[1] == min[1])
                        block.faces[3] = bmp;
                    Datas$1.deliver(block);
                };
                Generators.loop(min, max, func);
            }
            Buildings.type1 = type1;
        })(Buildings = Generators.Buildings || (Generators.Buildings = {}));
        let Roads;
        (function (Roads) {
            function oneway(axis, w, segs, sheet) {
                let staging = new StagingArea;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let road = {
                        type: 'Surface',
                        sheet: sheet,
                        sprite: Sprites$1.ROADS.SINGLE,
                        x: w[0],
                        y: seg + w[1],
                        z: w[2],
                        r: 3
                    };
                    road.adapt_sheet = Generators.roadMode == 'Adapt';
                    if (!seg || seg == segs - 1) {
                        road.sprite = Sprites$1.ROADS.SINGLE_OPEN;
                        if (!seg)
                            road.r += 1;
                        else if (seg == segs - 1)
                            road.r -= 1;
                    }
                    staging.addData(road);
                }
                if (axis == 0)
                    staging.ccw(1);
                staging.deliverReplace();
            }
            Roads.oneway = oneway;
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
                            sprite: Sprites$1.ROADS.SIDE_LINE,
                            x: seg + w[0],
                            y: lane + w[1],
                            z: 0,
                            r: !lane ? 2 : 0
                        };
                        if (!seg || seg == segs - 1) {
                            road.sprite = Sprites$1.ROADS.CONVEX_LINE;
                            road.adapt_sheet = Generators.roadMode == 'Adapt';
                            if (!seg && lane ||
                                seg == segs - 1 && !lane)
                                road.r += 1;
                        }
                        else if (lane == lanes - 1 && seg == 1 ||
                            !lane && seg == segs - 2) {
                            road.sprite = Sprites$1.ROADS.SIDE_STOP_LINE; // sideStopLine
                            road.flip = true;
                        }
                        staging.addData(road);
                    }
                }
                if (axis == 1)
                    staging.ccw(1);
                staging.deliverReplace();
            }
            Roads.twolane = twolane;
            function highway(axis, w, segs, lanes, sheet) {
                let staging = new StagingArea;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let lane = 0;
                    for (; lane < lanes; lane++) {
                        let road = {
                            type: 'Surface',
                            sheet: sheet,
                            sprite: Sprites$1.ROADS.SIDE_LINE,
                            x: lane + w[0],
                            y: seg + w[1],
                            z: 0,
                            r: !lane ? 3 : 1
                        };
                        if (lane > 0 && lane < lanes - 1)
                            road.sprite = Sprites$1.ROADS.MIDDLE_TRACKS;
                        else if (!seg || seg == segs - 1) {
                            road.sprite = Sprites$1.ROADS.CONVEX_LINE;
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
                staging.deliverReplace();
            }
            Roads.highway = highway;
        })(Roads = Generators.Roads || (Generators.Roads = {}));
        let Parking;
        (function (Parking) {
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
                            sprite: Sprites$1.ROADS.SIDE_CLEAR,
                            x: lane + w[0],
                            y: seg + w[1],
                            z: w[2],
                            r: !lane ? 3 : 1
                        };
                        let parkedCar = {
                            type: 'Car',
                            car: Cars$1.GetRandomName(),
                            x: road.x,
                            y: road.y,
                            z: road.z
                        };
                        let parkHere = false;
                        if (!seg || seg == segs - 1) {
                            if (!lane) {
                                road.sprite = Sprites$1.ROADS.SINGLE_OPEN;
                                road.adapt_sheet = Generators.roadMode == 'Adapt';
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
                                road.sprite = Sprites$1.ROADS.CUSTOM_NOTCH;
                                road.r = 1;
                                if (seg == 1)
                                    road.flip = true;
                            }
                            else if (lane == lanes - 1) {
                                road.sprite = Sprites$1.ROADS.CORNER;
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
                                road.sprite = Sprites$1.ROADS.PARKING_SPOT;
                                parkedCar.r = Math.PI / 4;
                                parkedCar.x = road.x + .5;
                                parkedCar.y = road.y - .11;
                                parkHere = true;
                            }
                            else
                                road.sprite = Sprites$1.ROADS.CLEAR;
                        }
                        if (parkHere && Math.random() < .75)
                            staging.addData(parkedCar);
                        staging.addData(road);
                    }
                }
                staging.deliverReplace();
            }
            Parking.onewayRight = onewayRight;
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
                            sprite: Sprites$1.ROADS.SIDE_LINE,
                            x: seg + w[0],
                            y: lane + w[1],
                            z: w[2],
                            r: 1
                        };
                        let parkedCar = {
                            type: 'Car',
                            car: Cars$1.GetRandomName(),
                            x: road.x,
                            y: road.y,
                            z: road.z
                        };
                        let parkHere = false;
                        if (!seg) {
                            road.adapt_sheet = Generators.roadMode == 'Adapt';
                            if (lane == 1) {
                                road.sprite = Sprites$1.ROADS.CONVEX_LINE;
                                road.r += 1;
                            }
                            else if (lane == 2) {
                                road.sprite = Sprites$1.ROADS.CONVEX_LINE;
                            }
                            else {
                                continue;
                            }
                        }
                        else if (seg == 1) {
                            if (lane == 1) {
                                road.sprite = Sprites$1.ROADS.SIDE_LINE;
                                road.r += 1;
                            }
                            else if (lane == 2) {
                                road.sprite = Sprites$1.ROADS.SIDE_LINE;
                                road.r -= 1;
                            }
                            else {
                                continue;
                            }
                        }
                        else if (seg == 2) {
                            if (lane == 0) {
                                road.sprite = Sprites$1.ROADS.CORNER;
                                parkHere = true;
                                parkedCar.r = Math.PI / 4;
                                parkedCar.x = road.x + 0.5 + 0.6;
                                parkedCar.y = road.y + 0.5;
                            }
                            else if (lane == 1) {
                                road.sprite = Sprites$1.ROADS.CONVEX_LINE;
                                road.r += 2;
                            }
                            else if (lane == 2) {
                                road.sprite = Sprites$1.ROADS.CONVEX_LINE;
                                road.r -= 1;
                            }
                            else if (lane == 3) {
                                road.sprite = Sprites$1.ROADS.CORNER;
                                road.r += 1;
                                parkHere = true;
                                parkedCar.r = Math.PI - Math.PI / 4;
                                parkedCar.x = road.x + 0.5 + 0.6;
                                parkedCar.y = road.y + 0.5;
                            }
                        }
                        else if (seg == segs - 1) {
                            if (lane == 0) {
                                road.sprite = Sprites$1.ROADS.CORNER;
                                road.r -= 1;
                            }
                            else if (lane == 3) {
                                road.sprite = Sprites$1.ROADS.CORNER;
                                road.r += 2;
                            }
                            else {
                                road.sprite = Sprites$1.ROADS.SIDE_CLEAR;
                            }
                        }
                        else if (lane == 1 || lane == 2) {
                            road.sprite = Sprites$1.ROADS.CLEAR;
                        }
                        else if (lane != 1) {
                            road.sprite = Sprites$1.ROADS.PARKING_SPOT;
                            parkHere = true;
                            // Bottom
                            if (!lane) {
                                road.r += 1;
                                road.flip = true;
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
                staging.deliverReplace();
            }
            Parking.leftBigHorz = leftBigHorz;
        })(Parking = Generators.Parking || (Generators.Parking = {}));
        let Fill;
        (function (Fill) {
            function fill1(min, object, extras = {}) {
                fill(min, min, object, extras);
            }
            Fill.fill1 = fill1;
            function fill(min, max, object, extras = {}) {
                let staging = new StagingArea;
                //const lanes = 1;
                let x = min[0];
                for (; x <= max[0]; x++) {
                    let y = min[1];
                    for (; y <= max[1]; y++) {
                        let pav = {
                            type: 'Surface',
                            x: x,
                            y: y,
                            z: min[2],
                        };
                        Object.assign(pav, object);
                        if (extras.WHEEL)
                            pav.r = Math.floor(Math.random() * 4);
                        staging.addData(pav);
                    }
                }
                staging.deliverReplace();
            }
            Fill.fill = fill;
        })(Fill = Generators.Fill || (Generators.Fill = {}));
        let Pavements;
        (function (Pavements) {
            function fill(w, width, height) {
                //const lanes = 1;
                let x = 0;
                for (; x < width; x++) {
                    let y = 0;
                    for (; y < height; y++) {
                        let pav = {
                            type: 'Surface',
                            sheet: 'yellowyPavement',
                            sprite: Sprites$1.PAVEMENTS.MIDDLE,
                            //sty: 'sty/floors/blue/256.bmp',
                            x: x + w[0],
                            y: y + w[1],
                            z: w[2],
                        };
                        Datas$1.deliver(pav);
                    }
                }
            }
            Pavements.fill = fill;
            function vert(x, y, z, segs, lanes) {
                //const lanes = 1;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let lane = 0;
                    for (; lane < lanes; lane++) {
                        let pav = {
                            type: 'Surface',
                            sheet: 'yellowyPavement',
                            sprite: Sprites$1.PAVEMENTS.MIDDLE,
                            //sty: 'sty/floors/blue/256.bmp',
                            x: lane + x,
                            y: seg + y,
                            z: 0
                        };
                        Datas$1.deliver(pav);
                    }
                }
            }
            Pavements.vert = vert;
            function Horz(x, y, z, segs, lanes) {
                //const lanes = 1;
                let seg = 0;
                for (; seg < segs; seg++) {
                    let lane = 0;
                    for (; lane < lanes; lane++) {
                        let pav = {
                            type: 'Surface',
                            sheet: 'yellowyPavement',
                            sprite: Sprites$1.PAVEMENTS.MIDDLE,
                            //sty: 'sty/floors/blue/256.bmp',
                            x: seg + y,
                            y: lane + x,
                            z: 0
                        };
                        Datas$1.deliver(pav);
                    }
                }
            }
            Pavements.Horz = Horz;
        })(Pavements = Generators.Pavements || (Generators.Pavements = {}));
    })(Generators || (Generators = {}));
    var Generators$1 = Generators;

    var Scenarios;
    (function (Scenarios) {
        function load(p) {
            Scenarios.current = p;
            Scenarios.current.load();
        }
        Scenarios.load = load;
        function update() {
            if (Scenarios.current)
                Scenarios.current.update();
        }
        Scenarios.update = update;
    })(Scenarios || (Scenarios = {}));
    var Scenarios$1 = Scenarios;

    var Spelling;
    (function (Spelling) {
        const typefaces = {
            small: {
                space: 9,
                break: -1,
                height: 23,
                beginnings: [
                    0, 11, 22, 33, 44, 55, 66, 77, 88, 96, 108, 121, 132, 148, 159, 170, 181, 192, 203, 214, 224, 235, 247, 263, 274, 286, 296,
                    304, 313, 325, 337, 350, 362, 374, 386, 398, 410, 422, 429, 435, 446, 452, 458, 471, 477, 488, 500, 509, 518
                ]
            },
            big: {
                space: 33,
                break: 26,
                height: 64,
                beginnings: [
                    0, 33, 65, 96, 127, 152, 180, 212, 244, 261, 291, 327, 354, 393, 425, 456, 487, 519, 550, 580, 608, 640, 672, 711, 744, 777, /*after z*/ 809,
                    0, 22, 54, 85, 120, 150, 181, 211, 242, 274, 306, 323, 340, 371, 388, 405, 442, 459, 490, 507, 540, 562, 583
                ]
            }
        };
        function symbol(a, b, c, d, e, f, g) {
            return { char: a, x: b, y: c, x2: d, y2: e, w: f, h: g };
        }
        // https://gtamp.com/text/?bg=0&font=2&color=0&shiny=0&imgtype=0&text=ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.%2C%3F%21%3B%7E%27%22%60%24%28%29-
        // ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.,?!;~'"`$()-
        const symbols = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', ' ', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            '.', ',', '?', '!', ';', '~', '\'', '"', '`', '$', '(', ')', '-'
        ];
        function build(text, font) {
            let typeface = typefaces[font];
            text = text.toUpperCase();
            let last_x = 0;
            let last_y = 128 / 2 - typeface.height;
            let sentence = { symbols: [] };
            for (let i = 0; i < text.length; i++) {
                let char = text[i];
                if (' ' == char) {
                    last_x += typeface.space;
                    continue;
                }
                if ('\n' == char) {
                    last_y += typeface.height;
                    last_x = 0;
                    continue;
                }
                let index = symbols.indexOf(char);
                if (index == -1)
                    continue;
                let x = typeface.beginnings[index];
                let y = 0, z = index + 1;
                if (typeface.break != -1 && index >= typeface.break) {
                    y = typeface.height;
                }
                //console.log('char', char, 'index', index);
                let w = typeface.beginnings[z] - x;
                sentence.symbols.push(symbol(char, last_x, last_y, x, y, w, typeface.height));
                last_x += w;
            }
            return sentence;
        }
        Spelling.build = build;
    })(Spelling || (Spelling = {}));
    var Spelling$1 = Spelling;

    var Letterer;
    (function (Letterer) {
        function init() {
            Letterer.canvas = document.createElement('canvas');
            document.body.appendChild(Letterer.canvas);
            console.log('letterer init');
            //let manager = new LoadingManager();
            const error = () => {
                KILL$1.critical('FONT');
            };
            let loader = new THREE.ImageLoader();
            loader.load('sty/fonts/small.png', (image) => {
                Letterer.smallFont = image;
                KILL$1.resourced('SMALL_FONT');
            }, undefined, error);
            let loader2 = new THREE.ImageLoader();
            loader2.load('sty/fonts/big.png', (image) => {
                Letterer.bigFont = image;
                KILL$1.resourced('BIG_FONT');
            }, undefined, error);
        }
        Letterer.init = init;
        function makeNiceText(text) {
            let spelling = Spelling$1.build(text, 'small');
            let canvasTexture = new THREE.CanvasTexture(Letterer.canvas);
            const paint = () => {
                canvasTexture.magFilter = THREE.NearestFilter;
                canvasTexture.minFilter = THREE.NearestFilter;
                const context = Letterer.canvas.getContext("2d");
                Letterer.canvas.width = 512;
                Letterer.canvas.height = 128;
                for (let symbol of spelling.symbols) {
                    context.drawImage(Letterer.smallFont, symbol.x2, symbol.y2, symbol.w, symbol.h, symbol.x, symbol.y, symbol.w, symbol.h);
                }
                let image = new Image();
                image.src = Letterer.canvas.toDataURL();
                canvasTexture.image = image;
                canvasTexture.needsUpdate = true;
            };
            paint();
            return canvasTexture;
        }
        Letterer.makeNiceText = makeNiceText;
    })(Letterer || (Letterer = {}));
    var Letterer$1 = Letterer;

    class WordBox {
        constructor() {
            console.log('new talking head');
            //Sheets.center(`sty/talking heads/${name}_1.bmp`);
            this.make();
        }
        setText(text, delay = 650) {
            if (this.texture)
                this.texture.dispose();
            this.texture = Letterer.makeNiceText(text);
            if (this.mesh) {
                this.material.map = this.texture;
                this.materialShadow.map = this.texture;
                this.mesh.visible = false;
                this.meshShadow.visible = false;
                setTimeout(() => {
                    this.mesh.visible = true;
                    this.meshShadow.visible = true;
                }, delay);
            }
        }
        destroy() {
            this.geometry.dispose();
            this.material.dispose();
        }
        make() {
            this.material = new THREE.MeshPhongMaterial({
                map: this.texture,
                transparent: true,
                shininess: 0,
                depthTest: false
            });
            this.materialShadow = this.material.clone();
            this.materialShadow.opacity = 0.35;
            this.materialShadow.color = new THREE.Color(0x0);
            this.geometry = new THREE.PlaneBufferGeometry(64, 16, 1);
            const scale = 5;
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.renderOrder = 2;
            this.mesh.scale.set(scale, scale, scale);
            this.mesh.visible = false;
            this.meshShadow = new THREE.Mesh(this.geometry, this.materialShadow);
            this.meshShadow.renderOrder = 1;
            this.meshShadow.scale.set(scale, scale, scale);
            this.meshShadow.visible = false;
            Four$1.scene.add(this.mesh);
            Four$1.scene.add(this.meshShadow);
            console.log('make word box');
        }
        update() {
            let pos = Four$1.camera.position.clone();
            let x = pos.x + 100;
            let y = pos.y - 80;
            let z = pos.z - 200;
            this.mesh.position.set(x, y, z);
            this.meshShadow.position.set(x + 1, y - 1, z);
        }
    }
    window.WordBox = WordBox;

    class TalkingHead {
        constructor(name) {
            console.log('new talking head');
            this.talkTime = 0;
            this.blinkTime = 0;
            this.blinkDelay = 3;
            this.openEyesDelay = 0.1;
            this.img = 0;
            this.imgs = [];
            this.imgs.push(Util$1.loadTexture(`sty/talking heads/${name}_1.png`));
            this.imgs.push(Util$1.loadTexture(`sty/talking heads/${name}_2.png`));
            this.imgs.push(Util$1.loadTexture(`sty/talking heads/${name}_3.png`));
            this.animateMouth = true;
            //Sheets.center(`sty/talking heads/${name}_1.bmp`);
            this.make();
        }
        talk(aye, delay = 0) {
            if (aye)
                this.animateMouth = true;
            else
                setTimeout(() => {
                    this.animateMouth = false;
                    this.blinkTime = .11;
                    this.blinkDelay = 3;
                    this.material.map = this.imgs[0];
                }, delay);
        }
        destroy() {
            this.geometry.dispose();
            this.material.dispose();
        }
        make() {
            this.material = new THREE.MeshPhongMaterial({
                map: this.imgs[0],
                transparent: true,
                shininess: 0,
                depthTest: false
            });
            this.materialShadow = this.material.clone();
            this.materialShadow.opacity = 0.35;
            this.materialShadow.color = new THREE.Color(0x0);
            this.geometry = new THREE.PlaneBufferGeometry(64, 64, 1);
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.meshShadow = new THREE.Mesh(this.geometry, this.materialShadow);
            this.mesh.renderOrder = 2;
            this.meshShadow.renderOrder = 1;
            Four$1.scene.add(this.mesh);
            Four$1.scene.add(this.meshShadow);
        }
        update() {
            if (this.animateMouth) {
                this.talkTime += Four$1.delta;
                if (this.talkTime > 0.2) {
                    this.img = this.img < 2 ? this.img + 2 : 0;
                    this.material.map = this.imgs[this.img];
                    this.talkTime = 0;
                }
            }
            else {
                this.blinkTime += Four$1.delta;
                if (this.blinkTime > this.blinkDelay) {
                    this.blinkTime = 0;
                    this.blinkDelay = 3 + Math.random() * 3;
                }
                else if (this.blinkTime > 0.11) {
                    this.material.map = this.imgs[0];
                }
                else if (this.blinkTime > 0) {
                    this.material.map = this.imgs[1];
                }
            }
            let pos = Four$1.camera.position.clone();
            let x = pos.x + 160;
            let y = pos.y - 80;
            let z = pos.z - 200;
            this.mesh.position.set(x, y, z);
            this.meshShadow.position.set(x + 2, y - 2, z);
        }
    }
    window.TalkingHead = TalkingHead;

    var HighWayWithEveryCar;
    (function (HighWayWithEveryCar) {
        function init() {
            console.log('Highway with every car init');
            const load = function () {
                Generators$1.Fill.fill([-500, -500, -3], [1000, 1000, 0], { sty: 'sty/special/water/1.bmp' }, { WHEEL: false });
                Generators$1.Roads.highway(1, [10, -7000, 0], 8000, 4, 'qualityRoads');
                let x = .5;
                let y = 0;
                let j = 0;
                for (let name of carNames) {
                    let car = {
                        type: 'Car',
                        car: name,
                        //paint: PaintJobs.Enum.DARK_GREEN,
                        x: 10 + x,
                        y: y + 7,
                        z: 0
                    };
                    y--;
                    j++;
                    if (j > 15) {
                        j = 0;
                        // Begin spawning at new lane
                        y = 0;
                        x += 1;
                    }
                    Datas$1.deliver(car);
                }
                console.log('loaded bridge scenario');
            };
            let stage = 0;
            let talkingHead;
            let wordBox;
            let viewingCar;
            const update = function () {
                if (stage == 0) {
                    talkingHead = new TalkingHead('johny_zoo');
                    wordBox = new WordBox();
                    wordBox.setText(`This highway has every car.`, 1000); // \nwith a "random" paint...
                    setTimeout(() => {
                        //talkingHead.talk(false);
                        wordBox.setText("Walk near a vehicle to see\nwhat it is.");
                        setTimeout(() => {
                            wordBox.setText("");
                            talkingHead.talk(false);
                            stage++;
                        }, 7000);
                    }, 7000);
                    stage++;
                }
                else if (stage == 2) {
                    let chunk = Datas$1.getChunk(KILL$1.ply.data);
                    const carArray = Cars$1.getArray();
                    let closest = 200;
                    let closestCar = null;
                    for (let car of carArray) {
                        let dist = Points$1.dist(car.data, KILL$1.ply.data);
                        if (dist < closest) {
                            closest = dist;
                            closestCar = car;
                        }
                    }
                    if (closestCar != viewingCar) {
                        viewingCar = closestCar;
                        wordBox.setText(`Car: ${closestCar.data.car}`);
                    }
                }
                talkingHead.update();
                wordBox.update();
            };
            let highwayWithEveryCar = {
                name: 'Highway with every car',
                load: load,
                update: update
            };
            Scenarios.load(highwayWithEveryCar);
        }
        HighWayWithEveryCar.init = init;
    })(HighWayWithEveryCar || (HighWayWithEveryCar = {}));
    var HighWayWithEveryCar$1 = HighWayWithEveryCar;

    var Cinematics;
    (function (Cinematics) {
        function init() {
            console.log('cinematics init');
        }
        Cinematics.init = init;
        function update() {
        }
        Cinematics.update = update;
        function missionText(words) {
            Letterer.makeNiceText(words);
        }
        Cinematics.missionText = missionText;
    })(Cinematics || (Cinematics = {}));
    var Cinematics$1 = Cinematics;

    var Rain;
    (function (Rain) {
        Rain.what_a_rainy_day = true;
        Rain.drops = [];
        Rain.group = null;
        /*export function smat_init() {

            let map = td.map(`sty/drop.png`);

            const params = {
                name: 'Rain Material',
                fog: false,

                //map: map,
                //color: 0x93e5ff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: .5,
                lights: false,
                depthTest: false, // false: rain falls through everything

                vertexShader: rain_vert,
                fragmentShader: THREE.ShaderChunk.meshbasic_frag
            };

            const o = Object.assign({
                uniforms: THREE.UniformsUtils.merge([
                    THREE.ShaderLib['basic'].uniforms, {
                        coords: { value: new THREE.Vector3(0, 0, 0) },
                        descend: { value: 0 }
                    }
                ]),
                defines: { 'USE_MAP': '', 'DISTANCE': '' },
            }, params);

            smat = new THREE.ShaderMaterial(o);

            smat.map = map;

            smat.uniforms.map.value = map;
            smat.uniforms.diffuse.value = new THREE.Color(0x93e5ff);
            smat.uniforms.opacity.value = params.opacity;
        }*/
        /*export function smat_clone() {
            let mat = smat.clone();
            
            mat.uniforms.map.value = smat.map;
            mat.uniforms.coords.value = new THREE.Vector3(0, 0, 0);
            mat.uniforms.descend.value = 0;

            return mat;
        }*/
        function init() {
            //smat_init();
            let map = Util$1.loadTexture(`sty/drop.png`);
            Rain.basicmat = new THREE.MeshBasicMaterial({
                map: map,
                color: 0xe5f7fc,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: .5,
                depthWrite: false,
            });
            Rain.group = new THREE.Group();
            Rain.group.rotation.y += 0.3;
            Rain.dropGeometry = new THREE.PlaneBufferGeometry(4, 1, 1, 1);
            Util$1.UV.rotatePlane(Rain.dropGeometry, 0, 3);
            Four$1.scene.add(Rain.group);
        }
        Rain.init = init;
        Rain.spread = 6;
        function make_drop() {
            if (Rain.drops.length > 500)
                return;
            let mesh = new THREE.Mesh(Rain.dropGeometry, Rain.basicmat);
            //mesh.matrixAutoUpdate = false;
            mesh.frustumCulled = false;
            const z = Four$1.camera.position.z;
            mesh.position.x = Four$1.camera.position.x + ((Math.random() - .5) * 64 * Rain.spread);
            mesh.position.y = Four$1.camera.position.y + ((Math.random() - .5) * 64 * Rain.spread);
            mesh.position.z = z;
            mesh.rotation.y = Math.PI / 2;
            //mesh.updateMatrix();
            let drop = {
                start: z,
                mesh: mesh,
                rand: Math.random()
            };
            Rain.drops.push(drop);
            Rain.group.add(mesh);
        }
        Rain.make_drop = make_drop;
        const speed =  7.0 ;
        let alternate = false;
        function update() {
            if (!Rain.what_a_rainy_day)
                return;
            alternate = !alternate;
            if ( alternate)
                return;
            make_drop();
            make_drop();
            make_drop();
            make_drop();
            make_drop();
            make_drop();
            make_drop();
            make_drop();
            make_drop();
            make_drop();
            let i = Rain.drops.length;
            while (i--) {
                let drop = Rain.drops[i];
                const fall = speed + drop.rand;
                drop.mesh.position.z -= fall;
                if (drop.start > drop.mesh.position.z + 300 || drop.mesh.position.z <= 0) {
                    //drops.splice(i, 1);
                    const z = Four$1.camera.position.z + 100;
                    drop.start = z;
                    drop.mesh.position.x = Four$1.camera.position.x + ((Math.random() - .5) * 64 * Rain.spread);
                    drop.mesh.position.y = Four$1.camera.position.y + ((Math.random() - .5) * 64 * Rain.spread);
                    drop.mesh.position.z = z;
                    //drop.mesh.updateMatrix();
                    //group.remove(drop.mesh);
                }
            }
        }
        Rain.update = update;
    })(Rain || (Rain = {}));

    // http://kitfox.com/projects/perlinNoiseMaker/
    var Mist;
    (function (Mist) {
        let material;
        let geometry;
        let mesh;
        let x, y;
        function init() {
            Mist.mode = 'stormy';
            x = 0;
            y = 0;
            const w = 5;
            geometry = new THREE.PlaneBufferGeometry(Chunks$1.tileSpan * 64 * w, Chunks$1.tileSpan * 64 * w, 1, 1);
            let perlin = Util$1.loadTexture('sty/perlin_1.png');
            perlin.wrapS = THREE.RepeatWrapping;
            perlin.wrapT = THREE.RepeatWrapping;
            perlin.repeat.set(w, w);
            material = new THREE.MeshPhongMaterial({
                map: perlin,
                color: 0x93e5ff,
                transparent: true,
                opacity: .3,
                depthWrite: false
            });
            mesh = new THREE.Mesh(geometry, material);
            Four$1.scene.add(mesh);
        }
        Mist.init = init;
        function normalize(n) {
            if (n > 1)
                n -= 1;
            if (n < 0)
                n += 1;
            return n;
        }
        function update() {
            let w = Four$1.camera.position;
            let tiled = Points$1.floor2(w.x / 64, w.y / 64);
            let p = Points$1.region(tiled, Chunks$1.tileSpan);
            mesh.position.set(p.x * Chunks$1.actualSize, p.y * Chunks$1.actualSize, 5);
            if ('stormy' == Mist.mode) {
                x += Four$1.delta / 2;
                y += Four$1.delta / 6;
            }
            else {
                x += Four$1.delta / 18;
                y += Four$1.delta / 55;
            }
            x = normalize(x);
            y = normalize(y);
            material.map.offset.set(x, y);
        }
        Mist.update = update;
    })(Mist || (Mist = {}));
    var Mist$1 = Mist;

    var KILL;
    (function (KILL) {
        var started = false;
        let RESOURCES;
        (function (RESOURCES) {
            RESOURCES[RESOURCES["UNDEFINED_OR_INIT"] = 0] = "UNDEFINED_OR_INIT";
            RESOURCES[RESOURCES["SMALL_FONT"] = 1] = "SMALL_FONT";
            RESOURCES[RESOURCES["BIG_FONT"] = 2] = "BIG_FONT";
            RESOURCES[RESOURCES["SPRITES"] = 3] = "SPRITES";
            RESOURCES[RESOURCES["COUNT"] = 4] = "COUNT";
        })(RESOURCES = KILL.RESOURCES || (KILL.RESOURCES = {}));
        let words = 0b0;
        function resourced(word) {
            let mask = RESOURCES[word];
            const bit = 0b1 << mask;
            words |= bit;
            can_we_begin_yet();
        }
        KILL.resourced = resourced;
        function can_we_begin_yet() {
            let count = 0;
            let i = 0;
            for (; i < RESOURCES.COUNT; i++)
                (words & 0b1 << i) ? count++ : void (0);
            if (count == RESOURCES.COUNT)
                start();
        }
        function critical(mask) {
            console.error('resource', mask);
        }
        KILL.critical = critical;
        function init() {
            console.log('kill init');
            resourced('UNDEFINED_OR_INIT');
            Phong2$1.rig();
            Rectangles$1.init();
            Surfaces$1.init();
            Blocks$1.init();
            BoxCutter$1.init();
            Cars$1.init();
            Sprites$1.init();
            Sheets$1.init();
            Cinematics$1.init();
            Letterer$1.init();
            Movie.init();
            Water$1.init();
            Mist$1.init();
            Rain.init();
            KILL.city = new City;
            window.KILL = KILL;
        }
        KILL.init = init;
        function start() {
            if (started)
                return;
            console.log('kill starting');
            started = true;
            HighWayWithEveryCar$1.init();
            //BridgeScenario.init();
            let data = {
                type: 'Ply',
                //remap: 16,
                x: 10.5,
                y: 1,
                z: 0
            };
            //data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];
            KILL.ply = new Ply(data);
            KILL.city.chunkList.get2(0, 0);
            KILL.city.chunkList.get2(0, 1);
        }
        KILL.start = start;
        function update() {
            if (!started)
                return;
            if (KILL.ply)
                KILL.ply.update();
            Water$1.update();
            Mist$1.update();
            Rain.update();
            Zoom$1.update();
            Scenarios$1.update();
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
            if (App.map[115] == 1)
                Movie.enabled = !Movie.enabled;
            if (Movie.enabled) {
                Movie.update();
                Movie.composer.render();
            }
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
            Four.directionalLight = new THREE.DirectionalLight(0x355886, 1.0);
            Four.directionalLight.position.set(0, 0, 1);
            Four.ambientLight = new THREE.AmbientLight('#ffffff'); // #5187cd
            //ambientLight = new AmbientLight('#c1c1c1'); // #5187cd
            //scene.add(directionalLight);
            Four.scene.add(Four.directionalLight.target);
            Four.scene.add(Four.ambientLight);
            Four.renderer = new THREE.WebGLRenderer({ antialias: true });
            Four.renderer.setPixelRatio(window.devicePixelRatio);
            Four.renderer.setSize(window.innerWidth, window.innerHeight);
            Four.renderer.autoClear = true;
            //renderer.setClearColor(0x777777, 1);
            Four.renderer.domElement.id = "main";
            document.body.appendChild(Four.renderer.domElement);
            window.addEventListener('resize', onWindowResize, false);
        }
        Four.init = init;
        function onWindowResize() {
            Four.camera.aspect = window.innerWidth / window.innerHeight;
            Four.camera.updateProjectionMatrix();
            Movie.resize();
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
