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
            return make(a.x * n, a.y * n);
        }
        Points.multp = multp;
        function region(a, n) {
            return floor2(a.x / n, a.y / n);
        }
        Points.region = region;
        function real_space(a) {
            return multp(a, 64);
        }
        Points.real_space = real_space;
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
        function init() {
            geometry = new THREE.BoxGeometry(N, N, 0);
            blue = new THREE.MeshBasicMaterial({ wireframe: true, color: 'blue' });
            purple = new THREE.MeshBasicMaterial({ wireframe: true, color: 'purple' });
        }
        Chunks.init = init;
        function scaffold(chunk) {
            let nany = chunk;
            nany.wireframe = new THREE.Mesh(geometry, purple);
            nany.wireframe.position.set(((chunk.w.x + 1) * N) - N / 2, ((chunk.w.y + 1) * N) - N / 2, 0);
            chunk.group.add(nany.wireframe);
        }
        Chunks.scaffold = scaffold;
        // The Test
        function vis(chunk, p) {
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
        Chunks.vis = vis;
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
            data.object = this;
        }
        destroy() {
            this.data.object = null;
        }
        update() {
            //console.log('update', this.data.type);
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
            let texture = mem[pepper];
            if (texture)
                return texture;
            texture = new THREE.TextureLoader().load(path);
            texture.name = pepper;
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
        let time;
        let j;
        let waters;
        function init() {
            time = 0;
            j = 0;
            waters = [];
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
                j += j < 11 ? 1 : -11;
                Water.material.map = waters[j];
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
        update() { }
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
            if (this.data.f)
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
        function carDeltaShader(phongProperties, p) {
            let material = new THREE.MeshPhongMaterial(phongProperties);
            material.onBeforeCompile = function (shader) {
                shader.uniforms.pink = { value: new THREE.Vector3(1, 0, 1) };
                shader.fragmentShader = shader.fragmentShader.replace(`#define PHONG`, `
				#define PHONG
				#define CARDELTASHADER
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

					texelColor = mapColor;

					texelColor = mapTexelToLinear( texelColor );

					diffuseColor *= texelColor;

				#endif
			`);
            };
            return material;
        }
        Phong2.carDeltaShader = carDeltaShader;
        function rectangleShader(phongProperties, p) {
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
        Phong2.rectangleShader = rectangleShader;
        function rectangleShadowShader(phongProperties, p) {
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
        Phong2.rectangleShadowShader = rectangleShadowShader;
    })(Phong2 || (Phong2 = {}));
    var Phong2$1 = Phong2;

    class Rectangle extends Object2 {
        constructor(data) {
            super(data);
            this.raise = 2;
            // the Defaults
            if (!this.data.width)
                this.data.width = 20;
            if (!this.data.height)
                this.data.height = 20;
        }
        destroy() {
            super.destroy();
            Rectangles$1.hide(this);
            this.geometry.dispose();
            this.material.dispose();
        }
        make_rectangle(params) {
            this.make_meshes(params);
            this.update_position();
            Rectangles$1.show(this);
        }
        make_meshes(info) {
            let map = Util$1.loadTexture(info.map);
            let blurMap = Util$1.loadTexture(info.blur);
            //blurMap.minFilter = LinearFilter;
            //blurMap.magFilter = LinearFilter;
            let shadowMap = Util$1.loadTexture(info.blur);
            this.geometry = new THREE.PlaneBufferGeometry(this.data.width, this.data.height, 1);
            this.material = Phong2$1.rectangleShader({
                name: 'Phong2',
                transparent: true,
                map: map,
                blending: THREE__default.NormalBlending
            }, {
                blurMap: blurMap
            });
            let materialShadow = Phong2$1.rectangleShadowShader({
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
        update() {
            super.update();
            Objects$1.relocate(this);
        }
        update_position() {
            let where = new THREE.Vector3(this.data.x * 64, this.data.y * 64, this.data.z * 64);
            this.mesh.position.copy(where);
            this.mesh.position.z += this.raise;
            this.meshShadow.position.copy(where);
            this.meshShadow.position.x += 3;
            this.meshShadow.position.y -= 3;
            this.mesh.rotation.z = this.data.r;
            this.meshShadow.rotation.z = this.data.r;
        }
    }

    // joke taken from the gta wikia when it described nyc.gci
    var APhysic;
    (function (APhysic) {
        function get(needle) {
            const car = list[needle];
            if (!car)
                console.warn(`Can\'t get physics for car ${needle}`);
            return car || null;
        }
        APhysic.get = get;
        function getROList() {
            return list;
        }
        APhysic.getROList = getROList;
        const list = {
            'Romero': {
                model: 0,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 16.5,
                front_drive_bias: 1,
                front_mass_bias: 0.5,
                brake_friction: 1.75,
                turn_in: 0.145,
                turn_ratio: 0.45,
                rear_end_stability: 1.25,
                handbrake_slide_value: 0.18,
                thrust: 0.152,
                max_speed: 0.245,
                anti_strength: 1,
                skid_threshhold: 0.065,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.68,
                gear3_multiplier: 1,
                gear2_speed: 0.107,
                gear3_speed: 0.165,
                x_img_width: 62,
                x_img_height: 64,
                x_colorless: false
            },
            'Wellard': {
                model: 1,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14.5,
                front_drive_bias: 1,
                front_mass_bias: 0.55,
                brake_friction: 2,
                turn_in: 0.65,
                turn_ratio: 0.35,
                rear_end_stability: 1.5,
                handbrake_slide_value: 0.25,
                thrust: 0.22,
                max_speed: 0.38,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.5,
                gear2_multiplier: 0.65,
                gear3_multiplier: 1,
                gear2_speed: 0.125,
                gear3_speed: 0.228,
                x_img_width: 44,
                x_img_height: 64,
                x_colorless: false
            },
            'Aniston BD4': {
                model: 2,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14.5,
                front_drive_bias: 0.6,
                front_mass_bias: 0.5,
                brake_friction: 1.75,
                turn_in: 0.145,
                turn_ratio: 0.45,
                rear_end_stability: 1.25,
                handbrake_slide_value: 0.18,
                thrust: 0.146,
                max_speed: 0.3,
                anti_strength: 1,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.725,
                gear3_multiplier: 1,
                gear2_speed: 0.11,
                gear3_speed: 0.175,
                x_img_width: 62,
                x_img_height: 64,
                x_colorless: false
            },
            'Pacifier': {
                model: 3,
                turbo: 0,
                value: 30,
                pad: 0,
                mass: 27,
                front_drive_bias: 0.5,
                front_mass_bias: 0.6,
                brake_friction: 0.9,
                turn_in: 0.25,
                turn_ratio: 0.75,
                rear_end_stability: 1.8,
                handbrake_slide_value: 0.15,
                thrust: 0.225,
                max_speed: 0.247,
                anti_strength: 0.5,
                skid_threshhold: 0.1,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.103,
                gear3_speed: 0.192,
                x_img_width: 50,
                x_img_height: 98,
                x_colorless: true
            },
            'G4 Bank Van': {
                model: 4,
                turbo: 0,
                value: 25,
                pad: 0,
                mass: 24,
                front_drive_bias: 0.5,
                front_mass_bias: 0.5,
                brake_friction: 1.5,
                turn_in: 0.5,
                turn_ratio: 0.4,
                rear_end_stability: 2,
                handbrake_slide_value: 0.75,
                thrust: 0.17,
                max_speed: 0.186,
                anti_strength: 0.5,
                skid_threshhold: 0.075,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.675,
                gear3_multiplier: 1,
                gear2_speed: 0.081,
                gear3_speed: 0.13,
                x_img_width: 60,
                x_img_height: 104,
                x_colorless: true
            },
            'Beamer': {
                model: 5,
                turbo: 1,
                value: 40,
                pad: 0,
                mass: 16,
                front_drive_bias: 1,
                front_mass_bias: 0.6,
                brake_friction: 3,
                turn_in: 0.75,
                turn_ratio: 0.4,
                rear_end_stability: 2,
                handbrake_slide_value: 0.5,
                thrust: 0.15,
                max_speed: 0.385,
                anti_strength: 1,
                skid_threshhold: 0.14,
                gear1_multiplier: 0.575,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.185,
                gear3_speed: 0.275,
                x_img_width: 62,
                x_img_height: 64,
                x_colorless: false
            },
            'Box Car': {
                model: 6,
                turbo: 0,
                value: 200,
                pad: 0,
                mass: 10,
                front_drive_bias: 0,
                front_mass_bias: 0.5,
                brake_friction: 0.9,
                turn_in: 0.1,
                turn_ratio: 0.9,
                rear_end_stability: 2,
                handbrake_slide_value: 0.2,
                thrust: 0.143,
                max_speed: 0.95,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.152,
                gear3_speed: 0.228,
                x_img_width: 42,
                x_img_height: 128,
                x_colorless: true
            },
            'Box Truck': {
                model: 7,
                turbo: 0,
                value: 90,
                pad: 0,
                mass: 28,
                front_drive_bias: 0.5,
                front_mass_bias: 0.7,
                brake_friction: 2,
                turn_in: 0.25,
                turn_ratio: 0.65,
                rear_end_stability: 2.5,
                handbrake_slide_value: 0.45,
                thrust: 0.185,
                max_speed: 0.175,
                anti_strength: 0.75,
                skid_threshhold: 0.065,
                gear1_multiplier: 0.545,
                gear2_multiplier: 0.675,
                gear3_multiplier: 1,
                gear2_speed: 0.088,
                gear3_speed: 0.114,
                x_img_width: 52,
                x_img_height: 128,
                x_colorless: false
            },
            'Bug': {
                model: 8,
                turbo: 0,
                value: 10,
                pad: 0,
                mass: 6.3,
                front_drive_bias: 1,
                front_mass_bias: 0.45,
                brake_friction: 1.265,
                turn_in: 0.3,
                turn_ratio: 0.175,
                rear_end_stability: 1.5,
                handbrake_slide_value: 0.65,
                thrust: 0.095,
                max_speed: 0.235,
                anti_strength: 1,
                skid_threshhold: 0.05,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.625,
                gear3_multiplier: 1,
                gear2_speed: 0.125,
                gear3_speed: 0.152,
                x_img_width: 50,
                x_img_height: 52,
                x_colorless: false
            },
            'Bulwark': {
                model: 9,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 17,
                front_drive_bias: 1,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.14,
                turn_ratio: 0.45,
                rear_end_stability: 1.5,
                handbrake_slide_value: 0.35,
                thrust: 0.185,
                max_speed: 0.307,
                anti_strength: 0.8,
                skid_threshhold: 0.075,
                gear1_multiplier: 0.65,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.155,
                gear3_speed: 0.225,
                x_img_width: 64,
                x_img_height: 64,
                x_colorless: false
            },
            'Bus': {
                model: 10,
                turbo: 0,
                value: 60,
                pad: 0,
                mass: 30,
                front_drive_bias: 0.5,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.25,
                turn_ratio: 0.65,
                rear_end_stability: 2.5,
                handbrake_slide_value: 0.75,
                thrust: 0.235,
                max_speed: 0.215,
                anti_strength: 0.75,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.1,
                gear3_speed: 0.161,
                x_img_width: 52,
                x_img_height: 128,
                x_colorless: true
            },
            'Cop Car': {
                model: 11,
                turbo: 1,
                value: 60,
                pad: 0,
                mass: 14.5,
                front_drive_bias: 1,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.433,
                turn_ratio: 0.4,
                rear_end_stability: 1.25,
                handbrake_slide_value: 0.4,
                thrust: 0.15,
                max_speed: 0.415,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.68,
                gear3_multiplier: 1,
                gear2_speed: 0.18,
                gear3_speed: 0.29,
                x_img_width: 58,
                x_img_height: 64,
                x_colorless: true
            },
            'Minx': {
                model: 12,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14.5,
                front_drive_bias: 0.75,
                front_mass_bias: 0.5,
                brake_friction: 1.75,
                turn_in: 0.145,
                turn_ratio: 0.45,
                rear_end_stability: 1.25,
                handbrake_slide_value: 0.18,
                thrust: 0.14,
                max_speed: 0.24,
                anti_strength: 1,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.68,
                gear3_multiplier: 1,
                gear2_speed: 0.12,
                gear3_speed: 0.166,
                x_img_width: 58,
                x_img_height: 58,
                x_colorless: false
            },
            'Eddy': {
                model: 13,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 15,
                front_drive_bias: 1,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.14,
                turn_ratio: 0.4,
                rear_end_stability: 1.2,
                handbrake_slide_value: 0.35,
                thrust: 0.165,
                max_speed: 0.3,
                anti_strength: 0.8,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.12,
                gear3_speed: 0.197,
                x_img_width: 54,
                x_img_height: 62,
                x_colorless: true
            },
            'Panto': {
                model: 14,
                turbo: 0,
                value: 10,
                pad: 0,
                mass: 7,
                front_drive_bias: 1,
                front_mass_bias: 0.5,
                brake_friction: 1.5,
                turn_in: 0.25,
                turn_ratio: 0.3,
                rear_end_stability: 1,
                handbrake_slide_value: 0.2,
                thrust: 0.058,
                max_speed: 0.165,
                anti_strength: 1.25,
                skid_threshhold: 0.04,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.082,
                gear3_speed: 0.12,
                x_img_width: 62,
                x_img_height: 56,
                x_colorless: false
            },
            'Fire Truck': {
                model: 15,
                turbo: 0,
                value: 60,
                pad: 0,
                mass: 32,
                front_drive_bias: 0.7,
                front_mass_bias: 0.46,
                brake_friction: 2.7,
                turn_in: 0.85,
                turn_ratio: 0.75,
                rear_end_stability: 0.55,
                handbrake_slide_value: 0.2,
                thrust: 0.233,
                max_speed: 0.255,
                anti_strength: 1,
                skid_threshhold: 0.15,
                gear1_multiplier: 0.575,
                gear2_multiplier: 0.775,
                gear3_multiplier: 1,
                gear2_speed: 0.124,
                gear3_speed: 0.19,
                x_img_width: 58,
                x_img_height: 124,
                x_colorless: true
            },
            'Shark': {
                model: 16,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 17,
                front_drive_bias: 1,
                front_mass_bias: 0.75,
                brake_friction: 1.5,
                turn_in: 0.65,
                turn_ratio: 0.65,
                rear_end_stability: 1,
                handbrake_slide_value: 0.3,
                thrust: 0.23,
                max_speed: 0.36,
                anti_strength: 1,
                skid_threshhold: 0.1,
                gear1_multiplier: 0.5,
                gear2_multiplier: 0.6,
                gear3_multiplier: 1,
                gear2_speed: 0.125,
                gear3_speed: 0.22,
                x_img_width: 54,
                x_img_height: 64,
                x_colorless: false
            },
            'GT-A1': {
                model: 17,
                turbo: 1,
                value: 60,
                pad: 0,
                mass: 14.5,
                front_drive_bias: 0.5,
                front_mass_bias: 0.5,
                brake_friction: 1.75,
                turn_in: 0.4,
                turn_ratio: 0.35,
                rear_end_stability: 1.25,
                handbrake_slide_value: 0.4,
                thrust: 0.175,
                max_speed: 0.45,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.725,
                gear3_multiplier: 1,
                gear2_speed: 0.225,
                gear3_speed: 0.35,
                x_img_width: 54,
                x_img_height: 64,
                x_colorless: false
            },
            'Garbage Truck': {
                model: 18,
                turbo: 0,
                value: 40,
                pad: 0,
                mass: 28,
                front_drive_bias: 0.5,
                front_mass_bias: 0.3,
                brake_friction: 2.5,
                turn_in: 0.25,
                turn_ratio: 0.55,
                rear_end_stability: 2,
                handbrake_slide_value: 0.35,
                thrust: 0.155,
                max_speed: 0.162,
                anti_strength: 1,
                skid_threshhold: 0.075,
                gear1_multiplier: 0.65,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.085,
                gear3_speed: 0.12,
                x_img_width: 52,
                x_img_height: 86,
                x_colorless: true
            },
            'Armed Land Roamer': {
                model: 24,
                turbo: 0,
                value: 30,
                pad: 0,
                mass: 12,
                front_drive_bias: 0.5,
                front_mass_bias: 0.6,
                brake_friction: 1.75,
                turn_in: 0.55,
                turn_ratio: 0.35,
                rear_end_stability: 1.3,
                handbrake_slide_value: 0.175,
                thrust: 0.13,
                max_speed: 0.24,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.6,
                gear3_multiplier: 1,
                gear2_speed: 0.12,
                gear3_speed: 0.152,
                x_img_width: 42,
                x_img_height: 48,
                x_colorless: true
            },
            'Hot Dog Van': {
                model: 20,
                turbo: 0,
                value: 30,
                pad: 0,
                mass: 24,
                front_drive_bias: 0.5,
                front_mass_bias: 0.3,
                brake_friction: 2,
                turn_in: 0.45,
                turn_ratio: 0.6,
                rear_end_stability: 1.15,
                handbrake_slide_value: 0.2,
                thrust: 0.188,
                max_speed: 0.241,
                anti_strength: 1,
                skid_threshhold: 0.07,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.63,
                gear3_multiplier: 1,
                gear2_speed: 0.094,
                gear3_speed: 0.146,
                x_img_width: 58,
                x_img_height: 88,
                x_colorless: true
            },
            'Ice-Cream Van': {
                model: 21,
                turbo: 0,
                value: 30,
                pad: 0,
                mass: 20,
                front_drive_bias: 0.5,
                front_mass_bias: 0.4,
                brake_friction: 2,
                turn_in: 0.45,
                turn_ratio: 0.6,
                rear_end_stability: 1.15,
                handbrake_slide_value: 0.2,
                thrust: 0.16,
                max_speed: 0.227,
                anti_strength: 1,
                skid_threshhold: 0.07,
                gear1_multiplier: 0.5,
                gear2_multiplier: 0.65,
                gear3_multiplier: 1,
                gear2_speed: 0.08,
                gear3_speed: 0.142,
                x_img_width: 58,
                x_img_height: 88,
                x_colorless: true
            },
            'Dementia Limousine': {
                model: 22,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 16,
                front_drive_bias: 0.5,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.125,
                turn_ratio: 0.5,
                rear_end_stability: 1.2,
                handbrake_slide_value: 0.2,
                thrust: 0.15,
                max_speed: 0.235,
                anti_strength: 1,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.111,
                gear3_speed: 0.173,
                x_img_width: 48,
                x_img_height: 78,
                x_colorless: false
            },
            'Dementia': {
                model: 23,
                turbo: 0,
                value: 10,
                pad: 0,
                mass: 6.3,
                front_drive_bias: 1,
                front_mass_bias: 0.45,
                brake_friction: 1.265,
                turn_in: 0.3,
                turn_ratio: 0.175,
                rear_end_stability: 1.5,
                handbrake_slide_value: 0.65,
                thrust: 0.095,
                max_speed: 0.235,
                anti_strength: 1,
                skid_threshhold: 0.05,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.625,
                gear3_multiplier: 1,
                gear2_speed: 0.125,
                gear3_speed: 0.152,
                x_img_width: 50,
                x_img_height: 46,
                x_colorless: false
            },
            'Land Roamer': {
                model: 24,
                turbo: 0,
                value: 5,
                pad: 0,
                mass: 12,
                front_drive_bias: 0.5,
                front_mass_bias: 0.6,
                brake_friction: 1.75,
                turn_in: 0.55,
                turn_ratio: 0.35,
                rear_end_stability: 1.3,
                handbrake_slide_value: 0.175,
                thrust: 0.13,
                max_speed: 0.24,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.6,
                gear3_multiplier: 1,
                gear2_speed: 0.12,
                gear3_speed: 0.152,
                x_img_width: 42,
                x_img_height: 48,
                x_colorless: true
            },
            'Jefferson': {
                model: 25,
                turbo: 1,
                value: 50,
                pad: 0,
                mass: 16,
                front_drive_bias: 1,
                front_mass_bias: 0.75,
                brake_friction: 2,
                turn_in: 0.65,
                turn_ratio: 0.45,
                rear_end_stability: 0.9,
                handbrake_slide_value: 0.2,
                thrust: 0.15,
                max_speed: 0.4,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.2,
                gear3_speed: 0.3,
                x_img_width: 46,
                x_img_height: 62,
                x_colorless: false
            },
            'Stretch Limousine': {
                model: 27,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 24,
                front_drive_bias: 0.5,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.25,
                turn_ratio: 0.65,
                rear_end_stability: 0.8,
                handbrake_slide_value: 0.2,
                thrust: 0.21,
                max_speed: 0.275,
                anti_strength: 0.75,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.12,
                gear3_speed: 0.215,
                x_img_width: 60,
                x_img_height: 112,
                x_colorless: false
            },
            'Sports Limousine': {
                model: 28,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 24,
                front_drive_bias: 1,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.2,
                turn_ratio: 0.6,
                rear_end_stability: 0.75,
                handbrake_slide_value: 0.2,
                thrust: 0.22,
                max_speed: 0.295,
                anti_strength: 0.75,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.135,
                gear3_speed: 0.23,
                x_img_width: 56,
                x_img_height: 110,
                x_colorless: false
            },
            'Medicar': {
                model: 29,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 20,
                front_drive_bias: 0.5,
                front_mass_bias: 0.475,
                brake_friction: 2.75,
                turn_in: 0.25,
                turn_ratio: 0.5,
                rear_end_stability: 0.7,
                handbrake_slide_value: 0.275,
                thrust: 0.231,
                max_speed: 0.338,
                anti_strength: 1,
                skid_threshhold: 0.1,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.135,
                gear3_speed: 0.237,
                x_img_width: 62,
                x_img_height: 114,
                x_colorless: true
            },
            'Benson': {
                model: 30,
                turbo: 1,
                value: 60,
                pad: 0,
                mass: 15.5,
                front_drive_bias: 0.5,
                front_mass_bias: 0.35,
                brake_friction: 2,
                turn_in: 0.25,
                turn_ratio: 0.4,
                rear_end_stability: 1.9,
                handbrake_slide_value: 0.35,
                thrust: 0.14,
                max_speed: 0.35,
                anti_strength: 1,
                skid_threshhold: 0.105,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.165,
                gear3_speed: 0.251,
                x_img_width: 38,
                x_img_height: 64,
                x_colorless: false
            },
            'Schmidt': {
                model: 31,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 8,
                front_drive_bias: 0.5,
                front_mass_bias: 0.3,
                brake_friction: 2,
                turn_in: 0.55,
                turn_ratio: 0.25,
                rear_end_stability: 2,
                handbrake_slide_value: 0.15,
                thrust: 0.09,
                max_speed: 0.2,
                anti_strength: 1.25,
                skid_threshhold: 0.03,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.1,
                gear3_speed: 0.15,
                x_img_width: 38,
                x_img_height: 56,
                x_colorless: false
            },
            'Miara': {
                model: 32,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14.5,
                front_drive_bias: 1,
                front_mass_bias: 0.65,
                brake_friction: 2,
                turn_in: 0.25,
                turn_ratio: 0.4,
                rear_end_stability: 1.25,
                handbrake_slide_value: 0.15,
                thrust: 0.195,
                max_speed: 0.35,
                anti_strength: 1,
                skid_threshhold: 0.12,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.145,
                gear3_speed: 0.245,
                x_img_width: 62,
                x_img_height: 64,
                x_colorless: false
            },
            'Big Bug': {
                model: 33,
                turbo: 0,
                value: 30,
                pad: 0,
                mass: 22,
                front_drive_bias: 0.5,
                front_mass_bias: 0.4,
                brake_friction: 2,
                turn_in: 0.1,
                turn_ratio: 0.6,
                rear_end_stability: 1.5,
                handbrake_slide_value: 0.2,
                thrust: 0.2,
                max_speed: 0.24,
                anti_strength: 1,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.104,
                gear3_speed: 0.175,
                x_img_width: 58,
                x_img_height: 58,
                x_colorless: false
            },
            'Morton': {
                model: 34,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 16.5,
                front_drive_bias: 0.5,
                front_mass_bias: 0.6,
                brake_friction: 2,
                turn_in: 0.45,
                turn_ratio: 0.55,
                rear_end_stability: 0.9,
                handbrake_slide_value: 0.2,
                thrust: 0.152,
                max_speed: 0.265,
                anti_strength: 1,
                skid_threshhold: 0.135,
                gear1_multiplier: 0.65,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.125,
                gear3_speed: 0.19,
                x_img_width: 48,
                x_img_height: 60,
                x_colorless: false
            },
            'Maurice': {
                model: 35,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 13,
                front_drive_bias: 1,
                front_mass_bias: 0.4,
                brake_friction: 1.75,
                turn_in: 0.25,
                turn_ratio: 0.35,
                rear_end_stability: 1.25,
                handbrake_slide_value: 0.25,
                thrust: 0.14,
                max_speed: 0.26,
                anti_strength: 1,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.68,
                gear3_multiplier: 1,
                gear2_speed: 0.12,
                gear3_speed: 0.175,
                x_img_width: 56,
                x_img_height: 58,
                x_colorless: false
            },
            'Pickup': {
                model: 36,
                turbo: 0,
                value: 15,
                pad: 0,
                mass: 16,
                front_drive_bias: 0.5,
                front_mass_bias: 0.6,
                brake_friction: 2,
                turn_in: 0.5,
                turn_ratio: 0.45,
                rear_end_stability: 0.5,
                handbrake_slide_value: 0.2,
                thrust: 0.135,
                max_speed: 0.255,
                anti_strength: 1,
                skid_threshhold: 0.08,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.12,
                gear3_speed: 0.19,
                x_img_width: 58,
                x_img_height: 64,
                x_colorless: false
            },
            'A-Type': {
                model: 37,
                turbo: 1,
                value: 50,
                pad: 0,
                mass: 15,
                front_drive_bias: 1,
                front_mass_bias: 0.6,
                brake_friction: 2,
                turn_in: 0.45,
                turn_ratio: 0.45,
                rear_end_stability: 1,
                handbrake_slide_value: 0.5,
                thrust: 0.126,
                max_speed: 0.385,
                anti_strength: 1,
                skid_threshhold: 0.118,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.175,
                gear3_speed: 0.272,
                x_img_width: 60,
                x_img_height: 64,
                x_colorless: false
            },
            'Arachnid': {
                model: 38,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14.5,
                front_drive_bias: 1,
                front_mass_bias: 0.5,
                brake_friction: 1.75,
                turn_in: 0.145,
                turn_ratio: 0.45,
                rear_end_stability: 1,
                handbrake_slide_value: 0.18,
                thrust: 0.152,
                max_speed: 0.285,
                anti_strength: 1,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.725,
                gear3_multiplier: 1,
                gear2_speed: 0.135,
                gear3_speed: 0.2,
                x_img_width: 54,
                x_img_height: 62,
                x_colorless: false
            },
            'Spritzer': {
                model: 39,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14,
                front_drive_bias: 0.5,
                front_mass_bias: 0.55,
                brake_friction: 2.5,
                turn_in: 0.145,
                turn_ratio: 0.4,
                rear_end_stability: 1,
                handbrake_slide_value: 0.55,
                thrust: 0.125,
                max_speed: 0.235,
                anti_strength: 1,
                skid_threshhold: 0.065,
                gear1_multiplier: 0.65,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.125,
                gear3_speed: 0.162,
                x_img_width: 60,
                x_img_height: 56,
                x_colorless: false
            },
            'Stinger': {
                model: 40,
                turbo: 1,
                value: 50,
                pad: 0,
                mass: 15,
                front_drive_bias: 0.6,
                front_mass_bias: 0.6,
                brake_friction: 3,
                turn_in: 0.1,
                turn_ratio: 0.65,
                rear_end_stability: 1,
                handbrake_slide_value: 0.3,
                thrust: 0.14,
                max_speed: 0.401,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.174,
                gear3_speed: 0.285,
                x_img_width: 52,
                x_img_height: 62,
                x_colorless: false
            },
            'Meteor': {
                model: 41,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 13.5,
                front_drive_bias: 0.5,
                front_mass_bias: 0.6,
                brake_friction: 2,
                turn_in: 0.35,
                turn_ratio: 0.5,
                rear_end_stability: 0.9,
                handbrake_slide_value: 0.2,
                thrust: 0.16,
                max_speed: 0.32,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.7,
                gear2_multiplier: 0.85,
                gear3_multiplier: 1,
                gear2_speed: 0.185,
                gear3_speed: 0.265,
                x_img_width: 60,
                x_img_height: 64,
                x_colorless: false
            },
            'Meteor Turbo': {
                model: 42,
                turbo: 1,
                value: 60,
                pad: 0,
                mass: 14.5,
                front_drive_bias: 0.5,
                front_mass_bias: 0.6,
                brake_friction: 1.75,
                turn_in: 0.45,
                turn_ratio: 0.4,
                rear_end_stability: 1.3,
                handbrake_slide_value: 0.4,
                thrust: 0.175,
                max_speed: 0.42,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.725,
                gear3_multiplier: 1,
                gear2_speed: 0.235,
                gear3_speed: 0.36,
                x_img_width: 60,
                x_img_height: 64,
                x_colorless: false
            },
            'Hachura': {
                model: 43,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14,
                front_drive_bias: 0.75,
                front_mass_bias: 0.6,
                brake_friction: 2,
                turn_in: 0.35,
                turn_ratio: 0.55,
                rear_end_stability: 0.9,
                handbrake_slide_value: 0.2,
                thrust: 0.225,
                max_speed: 0.4,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.5,
                gear2_multiplier: 0.72,
                gear3_multiplier: 1,
                gear2_speed: 0.185,
                gear3_speed: 0.3,
                x_img_width: 64,
                x_img_height: 64,
                x_colorless: false
            },
            'B-Type': {
                model: 44,
                turbo: 1,
                value: 50,
                pad: 0,
                mass: 15,
                front_drive_bias: 0.6,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.1,
                turn_ratio: 0.5,
                rear_end_stability: 0.85,
                handbrake_slide_value: 0.2,
                thrust: 0.14,
                max_speed: 0.401,
                anti_strength: 1,
                skid_threshhold: 0.125,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.174,
                gear3_speed: 0.29,
                x_img_width: 56,
                x_img_height: 64,
                x_colorless: false
            },
            'Taxi Xpress': {
                model: 45,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 15,
                front_drive_bias: 1,
                front_mass_bias: 0.6,
                brake_friction: 2,
                turn_in: 0.4,
                turn_ratio: 0.4,
                rear_end_stability: 0.7,
                handbrake_slide_value: 0.2,
                thrust: 0.145,
                max_speed: 0.27,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.65,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.135,
                gear3_speed: 0.21,
                x_img_width: 56,
                x_img_height: 64,
                x_colorless: true
            },
            'SWAT Van': {
                model: 46,
                turbo: 0,
                value: 90,
                pad: 0,
                mass: 22,
                front_drive_bias: 0.5,
                front_mass_bias: 0.6,
                brake_friction: 2,
                turn_in: 0.25,
                turn_ratio: 0.8,
                rear_end_stability: 1.4,
                handbrake_slide_value: 0.3,
                thrust: 0.175,
                max_speed: 0.225,
                anti_strength: 0.5,
                skid_threshhold: 0.13,
                gear1_multiplier: 0.65,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.115,
                gear3_speed: 0.166,
                x_img_width: 64,
                x_img_height: 98,
                x_colorless: true
            },
            'Michelli Roadster': {
                model: 47,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 13,
                front_drive_bias: 1,
                front_mass_bias: 0.8,
                brake_friction: 1,
                turn_in: 0.175,
                turn_ratio: 0.5,
                rear_end_stability: 0.75,
                handbrake_slide_value: 0.35,
                thrust: 0.175,
                max_speed: 0.388,
                anti_strength: 1,
                skid_threshhold: 0.1,
                gear1_multiplier: 0.65,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.165,
                gear3_speed: 0.275,
                x_img_width: 50,
                x_img_height: 64,
                x_colorless: false
            },
            'Tank': {
                model: 48,
                turbo: 0,
                value: 95,
                pad: 0,
                mass: 45,
                front_drive_bias: 0.5,
                front_mass_bias: 0.5,
                brake_friction: 4,
                turn_in: 0.25,
                turn_ratio: 0.75,
                rear_end_stability: 4,
                handbrake_slide_value: 0,
                thrust: 0.29,
                max_speed: 0.2,
                anti_strength: 0.25,
                skid_threshhold: 0.5,
                gear1_multiplier: 0.53,
                gear2_multiplier: 0.6,
                gear3_multiplier: 1,
                gear2_speed: 0.05,
                gear3_speed: 0.06,
                x_img_width: 46,
                x_img_height: 82,
                x_colorless: true
            },
            'Tanker': {
                model: 55,
                turbo: 0,
                value: 80,
                pad: 0,
                mass: 30,
                front_drive_bias: 0,
                front_mass_bias: 0.5,
                brake_friction: 0.9,
                turn_in: 0.1,
                turn_ratio: 0.8,
                rear_end_stability: 2,
                handbrake_slide_value: 0.2,
                thrust: 0,
                max_speed: 0.3,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.152,
                gear3_speed: 0.228,
                x_img_width: 44,
                x_img_height: 128,
                x_colorless: true
            },
            'Taxi': {
                model: 50,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14.5,
                front_drive_bias: 1,
                front_mass_bias: 0.55,
                brake_friction: 2.5,
                turn_in: 0.15,
                turn_ratio: 0.45,
                rear_end_stability: 1,
                handbrake_slide_value: 0.2,
                thrust: 0.13,
                max_speed: 0.219,
                anti_strength: 1,
                skid_threshhold: 0.065,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.125,
                gear3_speed: 0.175,
                x_img_width: 60,
                x_img_height: 64,
                x_colorless: true
            },
            'T-Rex': {
                model: 51,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 15.5,
                front_drive_bias: 1,
                front_mass_bias: 0.55,
                brake_friction: 2,
                turn_in: 0.35,
                turn_ratio: 0.35,
                rear_end_stability: 0.95,
                handbrake_slide_value: 0.35,
                thrust: 0.225,
                max_speed: 0.405,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.65,
                gear3_multiplier: 1,
                gear2_speed: 0.175,
                gear3_speed: 0.255,
                x_img_width: 60,
                x_img_height: 64,
                x_colorless: false
            },
            'Tow Truck': {
                model: 52,
                turbo: 0,
                value: 30,
                pad: 0,
                mass: 22,
                front_drive_bias: 0.5,
                front_mass_bias: 0.8,
                brake_friction: 2.5,
                turn_in: 0.5,
                turn_ratio: 0.8,
                rear_end_stability: 1,
                handbrake_slide_value: 0.85,
                thrust: 0.15,
                max_speed: 0.2,
                anti_strength: 1,
                skid_threshhold: 0.13,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.65,
                gear3_multiplier: 1,
                gear2_speed: 0.1,
                gear3_speed: 0.133,
                x_img_width: 58,
                x_img_height: 80,
                x_colorless: true
            },
            'Train': {
                model: 59,
                turbo: 0,
                value: 200,
                pad: 0,
                mass: 10,
                front_drive_bias: 0,
                front_mass_bias: 0.5,
                brake_friction: 0.9,
                turn_in: 0.1,
                turn_ratio: 0.8,
                rear_end_stability: 2,
                handbrake_slide_value: 0.2,
                thrust: 0.143,
                max_speed: 0.399,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.152,
                gear3_speed: 0.228,
                x_img_width: 42,
                x_img_height: 128,
                x_colorless: true
            },
            'Train Cab': {
                model: 60,
                turbo: 0,
                value: 200,
                pad: 0,
                mass: 10,
                front_drive_bias: 0,
                front_mass_bias: 0.5,
                brake_friction: 0.9,
                turn_in: 0.1,
                turn_ratio: 0.8,
                rear_end_stability: 2,
                handbrake_slide_value: 0.2,
                thrust: 0.143,
                max_speed: 0.95,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.152,
                gear3_speed: 0.228,
                x_img_width: 40,
                x_img_height: 128,
                x_colorless: true
            },
            'Train FB': {
                model: 61,
                turbo: 0,
                value: 200,
                pad: 0,
                mass: 10,
                front_drive_bias: 0,
                front_mass_bias: 0.5,
                brake_friction: 0.9,
                turn_in: 0.1,
                turn_ratio: 0.8,
                rear_end_stability: 2,
                handbrake_slide_value: 0.2,
                thrust: 0.143,
                max_speed: 0.95,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.152,
                gear3_speed: 0.228,
                x_img_width: 58,
                x_img_height: 74,
                x_colorless: true
            },
            'Trance-Am': {
                model: 56,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14,
                front_drive_bias: 1,
                front_mass_bias: 0.5,
                brake_friction: 3,
                turn_in: 0.1,
                turn_ratio: 0.4,
                rear_end_stability: 0.85,
                handbrake_slide_value: 0.3,
                thrust: 0.165,
                max_speed: 0.34,
                anti_strength: 1,
                skid_threshhold: 0.09,
                gear1_multiplier: 0.65,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.152,
                gear3_speed: 0.25,
                x_img_width: 54,
                x_img_height: 64,
                x_colorless: false
            },
            'Truck Cab': {
                model: 57,
                turbo: 0,
                value: 40,
                pad: 0,
                mass: 19,
                front_drive_bias: 1,
                front_mass_bias: 0.75,
                brake_friction: 1.75,
                turn_in: 0.75,
                turn_ratio: 0.7,
                rear_end_stability: 3,
                handbrake_slide_value: 0.1,
                thrust: 0.175,
                max_speed: 0.2,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.45,
                gear2_multiplier: 0.6,
                gear3_multiplier: 1,
                gear2_speed: 0.075,
                gear3_speed: 0.108,
                x_img_width: 64,
                x_img_height: 64,
                x_colorless: false
            },
            'Truck Cab SX': {
                model: 58,
                turbo: 0,
                value: 40,
                pad: 0,
                mass: 19,
                front_drive_bias: 0.487,
                front_mass_bias: 0.189,
                brake_friction: 2,
                turn_in: 0,
                turn_ratio: 0.527,
                rear_end_stability: 2,
                handbrake_slide_value: 0.2,
                thrust: 0.3,
                max_speed: 0.2,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.075,
                gear3_speed: 0.108,
                x_img_width: 64,
                x_img_height: 64,
                x_colorless: false
            },
            'Container': {
                model: 59,
                turbo: 0,
                value: 60,
                pad: 0,
                mass: 30,
                front_drive_bias: 0,
                front_mass_bias: 0.5,
                brake_friction: 0.9,
                turn_in: 0.1,
                turn_ratio: 0.8,
                rear_end_stability: 2,
                handbrake_slide_value: 0.2,
                thrust: 0,
                max_speed: 0.2,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0,
                gear3_speed: 0,
                x_img_width: 42,
                x_img_height: 128,
                x_colorless: true
            },
            'Transporter': {
                model: 60,
                turbo: 0,
                value: 70,
                pad: 0,
                mass: 30,
                front_drive_bias: 0,
                front_mass_bias: 0.5,
                brake_friction: 0.9,
                turn_in: 0.1,
                turn_ratio: 0.8,
                rear_end_stability: 2,
                handbrake_slide_value: 0.2,
                thrust: 0,
                max_speed: 0.2,
                anti_strength: 1,
                skid_threshhold: 0.139,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0,
                gear3_speed: 0,
                x_img_width: 40,
                x_img_height: 128,
                x_colorless: true
            },
            'TV Van': {
                model: 61,
                turbo: 0,
                value: 20,
                pad: 0,
                mass: 19,
                front_drive_bias: 0.5,
                front_mass_bias: 0.8,
                brake_friction: 2.5,
                turn_in: 0.5,
                turn_ratio: 0.8,
                rear_end_stability: 1,
                handbrake_slide_value: 0.85,
                thrust: 0.15,
                max_speed: 0.205,
                anti_strength: 1,
                skid_threshhold: 0.13,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.65,
                gear3_multiplier: 1,
                gear2_speed: 0.1,
                gear3_speed: 0.14,
                x_img_width: 58,
                x_img_height: 74,
                x_colorless: false
            },
            'Van': {
                model: 61,
                turbo: 0,
                value: 20,
                pad: 0,
                mass: 19,
                front_drive_bias: 0.5,
                front_mass_bias: 0.8,
                brake_friction: 2.5,
                turn_in: 0.5,
                turn_ratio: 0.8,
                rear_end_stability: 1,
                handbrake_slide_value: 0.85,
                thrust: 0.15,
                max_speed: 0.205,
                anti_strength: 1,
                skid_threshhold: 0.13,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.65,
                gear3_multiplier: 1,
                gear2_speed: 0.1,
                gear3_speed: 0.14,
                x_img_width: 58,
                x_img_height: 74,
                x_colorless: false
            },
            'U-Jerk Truck': {
                model: 62,
                turbo: 0,
                value: 20,
                pad: 0,
                mass: 16,
                front_drive_bias: 0.5,
                front_mass_bias: 0.75,
                brake_friction: 2,
                turn_in: 0.75,
                turn_ratio: 0.5,
                rear_end_stability: 0.25,
                handbrake_slide_value: 0.2,
                thrust: 0.11,
                max_speed: 0.225,
                anti_strength: 1,
                skid_threshhold: 0.11,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.085,
                gear3_speed: 0.15,
                x_img_width: 54,
                x_img_height: 56,
                x_colorless: false
            },
            'Z-Type': {
                model: 44,
                turbo: 1,
                value: 50,
                pad: 0,
                mass: 15,
                front_drive_bias: 1,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.4,
                turn_ratio: 0.35,
                rear_end_stability: 1.175,
                handbrake_slide_value: 0.4,
                thrust: 0.145,
                max_speed: 0.405,
                anti_strength: 1,
                skid_threshhold: 0.12,
                gear1_multiplier: 0.6,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.19,
                gear3_speed: 0.284,
                x_img_width: 56,
                x_img_height: 64,
                x_colorless: false
            },
            'Rumbler': {
                model: 64,
                turbo: 1,
                value: 50,
                pad: 0,
                mass: 15,
                front_drive_bias: 0.5,
                front_mass_bias: 0.375,
                brake_friction: 3.5,
                turn_in: 0.25,
                turn_ratio: 0.65,
                rear_end_stability: 1.4,
                handbrake_slide_value: 0.35,
                thrust: 0.14,
                max_speed: 0.401,
                anti_strength: 1,
                skid_threshhold: 0.115,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.175,
                gear3_speed: 0.27,
                x_img_width: 56,
                x_img_height: 64,
                x_colorless: false
            },
            /*'Wreck 0': {
    model: 72,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 36,
    image_height: 112
            },
            'Wreck 1': {
    model: 73,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 40,
    image_height: 74
            },
            'Wreck 2': {
    model: 74,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 46,
    image_height: 82
            },
            'Wreck 3': {
    model: 75,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 52,
    image_height: 64
            },
            'Wreck 4': {
    model: 76,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 50,
    image_height: 64
            },
            'Wreck 5': {
    model: 77,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 64,
    image_height: 64
            },
            'Wreck 6': {
    model: 78,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 64,
    image_height: 64
            },
            'Wreck 7': {
    model: 79,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 64,
    image_height: 64
            },
            'Wreck 8': {
    model: 80,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 64,
    image_height: 64
            },
            'Wreck 9': {
    model: 81,
    turbo: 0,
    value: 0,
    pad: 0,
    mass: 10,
    front drive bias: 0,
    front mass bias: 0.5,
    brake friction: 0.9,
    turn in: 0.1,
    turn ratio: 0.8,
    rear end stability: 2,
    handbrake slide value: 0.2,
    thrust: 0,
    max_speed: 0.95,
    anti strength: 1,
    skid threshhold: 0.139,
    gear1 multiplier: 0.6,
    gear2 multiplier: 0.8,
    gear3 multiplier: 1,
    gear2 speed: 0.152,
    gear3 speed: 0.228,
    image_width: 64,
    image_height: 64
            },*/
            'Jagular XK': {
                model: 75,
                turbo: 0,
                value: 50,
                pad: 0,
                mass: 14,
                front_drive_bias: 0.5,
                front_mass_bias: 0.5,
                brake_friction: 2,
                turn_in: 0.35,
                turn_ratio: 0.45,
                rear_end_stability: 1.4,
                handbrake_slide_value: 0.35,
                thrust: 0.185,
                max_speed: 0.33,
                anti_strength: 1,
                skid_threshhold: 0.105,
                gear1_multiplier: 0.65,
                gear2_multiplier: 0.8,
                gear3_multiplier: 1,
                gear2_speed: 0.18,
                gear3_speed: 0.255,
                x_img_width: 52,
                x_img_height: 64,
                x_colorless: false
            },
            'Furore GT': {
                model: 76,
                turbo: 1,
                value: 50,
                pad: 0,
                mass: 14.104,
                front_drive_bias: 0.156,
                front_mass_bias: 0.61,
                brake_friction: 2.015,
                turn_in: 0.063,
                turn_ratio: 0.993,
                rear_end_stability: 0.85,
                handbrake_slide_value: 0.1,
                thrust: 0.142,
                max_speed: 0.416,
                anti_strength: 1,
                skid_threshhold: 0.142,
                gear1_multiplier: 0.626,
                gear2_multiplier: 0.797,
                gear3_multiplier: 1,
                gear2_speed: 0.235,
                gear3_speed: 0.35,
                x_img_width: 50,
                x_img_height: 64,
                x_colorless: false
            },
            'Special Agent Car': {
                model: 84,
                turbo: 0,
                value: 70,
                pad: 0,
                mass: 15,
                front_drive_bias: 1,
                front_mass_bias: 0.6,
                brake_friction: 2,
                turn_in: 0.155,
                turn_ratio: 0.45,
                rear_end_stability: 1.2,
                handbrake_slide_value: 0.35,
                thrust: 0.165,
                max_speed: 0.3,
                anti_strength: 0.8,
                skid_threshhold: 0.085,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.7,
                gear3_multiplier: 1,
                gear2_speed: 0.13,
                gear3_speed: 0.195,
                x_img_width: 64,
                x_img_height: 64,
                x_colorless: false
            },
            'Karma Bus': {
                model: 26,
                turbo: 0,
                value: 30,
                pad: 0,
                mass: 22,
                front_drive_bias: 0.5,
                front_mass_bias: 0.4,
                brake_friction: 2,
                turn_in: 0.45,
                turn_ratio: 0.6,
                rear_end_stability: 1.15,
                handbrake_slide_value: 0.2,
                thrust: 0.165,
                max_speed: 0.275,
                anti_strength: 1,
                skid_threshhold: 0.07,
                gear1_multiplier: 0.55,
                gear2_multiplier: 0.75,
                gear3_multiplier: 1,
                gear2_speed: 0.115,
                gear3_speed: 0.165,
                x_img_width: 44,
                x_img_height: 100,
                x_colorless: true
            }
        };
    })(APhysic || (APhysic = {}));
    var APhysic$1 = APhysic;

    var Cars;
    (function (Cars) {
        /// names
        // const contexts
        Cars.Names2 = [
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
            "Meteor", "Meteor Turbo", "Hachura", "B-Type",
            "Taxi Xpress", "SWAT Van", "Michelli Roadster", "Tank",
            "Tanker", "Taxi", "T-Rex", "Tow Truck",
            "Train", "Train Cab", "Train FB", "Trance-Am",
            "Truck Cab", "Truck Cab SX", "Container", "Transporter",
            "TV Van", "Van", "U-Jerk Truck", "Z-Type",
            "Rumbler",
            "Jagular XK",
            "Furore GT", "Special Agent Car", "Karma Bus"
        ];
        /// sprays 
        let Sprays;
        (function (Sprays) {
            Sprays[Sprays["BLUE1"] = 0] = "BLUE1";
            Sprays[Sprays["PURPLE1"] = 1] = "PURPLE1";
            Sprays[Sprays["BLACK"] = 2] = "BLACK";
            Sprays[Sprays["BLUE2"] = 3] = "BLUE2";
            Sprays[Sprays["BLUE_GRAY"] = 4] = "BLUE_GRAY";
            Sprays[Sprays["BRIGHT_GREEN"] = 5] = "BRIGHT_GREEN";
            Sprays[Sprays["BRIGHT_RED"] = 6] = "BRIGHT_RED";
            Sprays[Sprays["BROWN1"] = 7] = "BROWN1";
            Sprays[Sprays["BROWN2"] = 8] = "BROWN2";
            Sprays[Sprays["SILVER_BLUE"] = 9] = "SILVER_BLUE";
            Sprays[Sprays["CREAM"] = 10] = "CREAM";
            Sprays[Sprays["YELLOW"] = 11] = "YELLOW";
            Sprays[Sprays["CYAN"] = 12] = "CYAN";
            Sprays[Sprays["DARK_BEIGE"] = 13] = "DARK_BEIGE";
            Sprays[Sprays["DARK_BLUE"] = 14] = "DARK_BLUE";
            Sprays[Sprays["DEEP_BLUE"] = 15] = "DEEP_BLUE";
            Sprays[Sprays["DARK_GREEN"] = 16] = "DARK_GREEN";
            Sprays[Sprays["DARK_RED"] = 17] = "DARK_RED";
            Sprays[Sprays["DARK_RUST"] = 18] = "DARK_RUST";
            Sprays[Sprays["GOLD"] = 19] = "GOLD";
            Sprays[Sprays["GREEN"] = 20] = "GREEN";
            Sprays[Sprays["GRAY"] = 21] = "GRAY";
            Sprays[Sprays["YELLOW_GREEN"] = 22] = "YELLOW_GREEN";
            Sprays[Sprays["OLIVE"] = 23] = "OLIVE";
            Sprays[Sprays["ORANGE"] = 24] = "ORANGE";
            Sprays[Sprays["PALE_BLUE"] = 25] = "PALE_BLUE";
            Sprays[Sprays["PINK_RED"] = 26] = "PINK_RED";
            Sprays[Sprays["PURPLE2"] = 27] = "PURPLE2";
            Sprays[Sprays["RED"] = 28] = "RED";
            Sprays[Sprays["RUST"] = 29] = "RUST";
            Sprays[Sprays["SILVER"] = 30] = "SILVER";
            Sprays[Sprays["SKY_BLUE"] = 31] = "SKY_BLUE";
            Sprays[Sprays["TURQUOISE"] = 32] = "TURQUOISE";
            Sprays[Sprays["WHITE_GRAY"] = 33] = "WHITE_GRAY";
            Sprays[Sprays["WHITE"] = 34] = "WHITE";
            Sprays[Sprays["COP"] = 35] = "COP";
        })(Sprays = Cars.Sprays || (Cars.Sprays = {}));
        function getSpray(id) {
            return Sprays[name];
        }
        Cars.getSpray = getSpray;
        /// functions
        function init() {
            cars = [];
            make_sheets();
        }
        Cars.init = init;
        var cars;
        function getCars() {
            return cars;
        }
        Cars.getCars = getCars;
        function add(car) {
            cars.push(car);
        }
        Cars.add = add;
        function remove(car) {
            cars.splice(cars.indexOf(car), 1);
        }
        Cars.remove = remove;
        // deltas (damage / doors / etc)
        Cars.deltasSheets = {};
        function make_sheets() {
            const list = APhysic$1.getROList();
            for (let name in list) {
                let physics = APhysic$1.get(name);
                const sheet = {
                    file: `sty/car/painted_deltas/D_GTA2_CAR_`,
                    padding: 4,
                    width: (physics.x_img_width * 10) + 9 * 4,
                    height: (physics.x_img_height * 2) + 4,
                    nr: {
                        w: 10,
                        h: 2
                    },
                    piece: {
                        w: physics.x_img_width,
                        h: physics.x_img_height
                    }
                };
                Cars.deltasSheets[name] = sheet;
            }
        }
        Cars.make_sheets = make_sheets;
        Cars.deltaSquares = {
            dent_behind_left: { x: 1, y: 1 },
            dent_behind_right: { x: 2, y: 1 },
            dent_front_right: { x: 3, y: 1 },
            dent_front_left: { x: 4, y: 1 },
            dent_in_the_roof_here: { x: 5, y: 1 },
            tail_light_right: { x: 6, y: 1 },
            tail_light_left: { x: 6, y: 1 },
            head_light_right: { x: 7, y: 1 },
            head_light_left: { x: 7, y: 1 },
            front_door1: { x: 8, y: 1 },
            front_door2: { x: 9, y: 1 },
            front_door3: { x: 10, y: 1 },
            front_door4: { x: 1, y: 2 },
            rear_door1: { x: 2, y: 2 },
            rear_door2: { x: 3, y: 2 },
            rear_door3: { x: 4, y: 2 },
            rear_door4: { x: 5, y: 2 },
            tv_van_dish: { x: 6, y: 2 }
        };
        Cars.scriptCodes = {
            'Aniston BD4': 'AMDB4',
            'Arachnid': 'SPIDER',
            'Armed Land Roamer': 'GUNJEEP',
            'A-Type': 'RTYPE',
            'Beamer': 'BMW',
            'Benson': 'MERC',
            'Box Truck': 'BOXTRUCK',
            'Big Bug': 'MONSTER',
            'B-Type': 'STYPE',
            'Bug': 'BUG',
            'Bus': 'BUS',
            'Bulwark': 'BUICK',
            'Box Car': 'BOXCAR',
            'Container': 'TRUKCONT',
            'Cop Car': 'COPCAR',
            'Dementia': 'ISETTA',
            'Dementia Limousine': 'ISETLIMO',
            'Eddy': 'EDSEL',
            'Fire Truck': 'FIRETRUK',
            'Furore GT': 'ZCX5',
            'G4 Bank Van': 'BANKVAN',
            'Garbage Truck': 'GTRUCK',
            'GT-A1': 'GT24640',
            'Hachura': 'STRIPETB',
            'Hot Dog Van': 'HOTDOG',
            'Ice-Cream Van': 'ICECREAM',
            'Jagular XK': 'XK120',
            'Jefferson': 'JEFFREY',
            'Karma Bus': 'KRSNABUS',
            'Land Roamer': 'JEEP',
            'Maurice': 'MORRIS',
            'Medicar': 'MEDICAR',
            'Meteor': 'STRATOS',
            'Meteor Turbo': 'STRATOSB',
            'Miara': 'MIURA',
            'Michelli Roadster': 'T2000GT',
            'Minx': 'DART',
            'Morton': 'MORGAN',
            'Pacifier': 'APC',
            'Panto': 'FIAT',
            'Pickup': 'PICKUP',
            'Romero': 'ALFA',
            'Rumbler': 'WBTWIN',
            'Schmidt': 'MESSER',
            'Shark': 'GRAHAM',
            'Special Agent Car': 'EDSELFBI',
            'Sports Limousine': 'LIMO2',
            'Spritzer': 'SPRITE',
            'Stinger': 'STINGRAY',
            'Stretch Limousine': 'LIMO',
            'SWAT Van': 'SWATVAN',
            'Tank': 'TANK',
            'Tanker': 'TANKER',
            'Taxi': 'TAXI',
            'Taxi Xpress': 'STYPECAB',
            'Tow Truck': 'TOWTRUCK',
            'Train': 'TRAIN',
            'Train Cab': 'TRAINCAB',
            'Train FB': 'TRAINFB',
            'Trance-Am': 'TRANCEAM',
            'Transporter': 'TRUKTRNS',
            'T-Rex': 'TBIRD',
            'Truck Cab': 'TRUKCAB1',
            'Truck Cab SX': 'TRUKCAB2',
            'TV Van': 'TVVAN',
            'U-Jerk Truck': 'VESPA',
            'Van': 'VAN',
            'Wellard': 'ALLARD',
            'Z-Type': 'VTYPE'
        };
        /// tests, useful for #highway
        function checkDims() {
            for (let car of cars) {
                let mat = car.material;
                if (!car.physics || !mat.map.image)
                    continue;
                if (car.physics.x_img_width != mat.map.image.width ||
                    car.physics.x_img_height != mat.map.image.height)
                    console.warn(`warning for ${car.data.car}`);
            }
        }
        Cars.checkDims = checkDims;
    })(Cars || (Cars = {}));
    window.Cars = Cars;
    var Cars$1 = Cars;

    class Car extends Rectangle {
        constructor(data) {
            super(data);
            console.warn('Car', data.car);
            this.deltas = [];
            Cars$1.add(this);
            if (undefined == data.car)
                data.car = 'Minx';
            this.raise = 1;
            this.make(this.data);
            this.sheet = Cars$1.deltasSheets[data.car];
            //this.add_delta(Cars.deltaSquares.dent_front_left);
        }
        destroy() {
            console.warn('Car destroy');
            super.destroy();
            Cars$1.remove(this);
        }
        update() {
            super.update();
            this.update_position();
        }
        make(data) {
            this.physics = APhysic$1.get(data.car);
            const model = this.physics.model;
            let unpaint = this.physics.x_colorless || undefined == data.spray;
            if (unpaint) {
                this.sty = `sty/car/unpainted/GTA2_CAR_${model}X.bmp`;
                this.deltaSty = `sty/car/pinky_deltas/D_GTA2_CAR_${model}.bmp`;
            }
            else {
                let pal = `_PAL_${data.spray}`;
                this.sty = `sty/car/painted/GTA2_CAR_${model}${pal}.bmp`;
                this.deltaSty = `sty/car/painted_deltas/D_GTA2_CAR_${model}${pal}.bmp`;
            }
            data.width = this.physics.x_img_width;
            data.height = this.physics.x_img_height;
            this.make_rectangle({
                map: this.sty,
                blur: `sty/car/blurs/GTA2_CAR_${model}.png`,
                shadow: data.sty
            });
        }
        // todo, cleanup
        add_delta(square) {
            const OFFSET = 0.1;
            let mesh, material;
            material = Phong2$1.carDeltaShader({
                transparent: true,
                map: Util$1.loadTexture(this.deltaSty)
            }, {});
            mesh = new THREE.Mesh(this.geometry.clone(), material);
            mesh.position.set(0, 0, OFFSET);
            this.mesh.add(mesh);
            Util$1.UV.fromSheet(mesh.geometry, square, this.sheet);
            let length = this.deltas.push({
                sprite: square,
                mesh: mesh
            });
            return this.deltas[length - 1];
        }
        remove_delta(square) {
            for (let delta of this.deltas) {
                if (delta.sprite != square)
                    continue;
                this.mesh.remove(delta.mesh);
                this.deltas.splice(this.deltas.indexOf(delta), 1);
                delta.mesh.geometry.dispose();
                delta.mesh.material.dispose();
                return;
            }
        }
        has_delta(square) {
            for (let delta of this.deltas) {
                if (delta.sprite == square)
                    return true;
            }
            return false;
        }
    }

    // aka data maker
    var Datas;
    (function (Datas) {
        function big(data) {
            let w = Points$1.floor2(data.x / Chunks$1.tileSpan, data.y / Chunks$1.tileSpan);
            return w;
        }
        Datas.big = big;
        function getChunk(data) {
            let w = big(data);
            let chunk = KILL$1.city.chunkList.getCreate(w);
            return chunk;
        }
        Datas.getChunk = getChunk;
        function deliver(data) {
            let chunk = getChunk(data);
            chunk._add(data);
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
                    chunk._remove(B);
                }
            }
            if (C && C.sheet && A.adapt_sheet)
                A.sheet = C.sheet;
            chunk._add(A);
        }
        Datas.replaceDeliver = replaceDeliver;
        // for testing
        window.Datas__ = Datas;
    })(Datas || (Datas = {}));
    var Datas$1 = Datas;

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
                data.remap = 15 + KILL$1.floor_random(53) - 15;
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
            this.make_rectangle({
                map: data.sty,
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
            this.update_position();
        }
    }

    class Ply extends Ped {
        constructor(data) {
            super(data);
            console.log('Ply');
            KILL$1.ply = this;
            window.ply = this;
        }
        update() {
            this.update_position();
        }
        manual_update() {
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
            this.update_position();
        }
    }

    var Objects;
    (function (Objects) {
        function factory(data) {
            switch (data.type) {
                //case 'Ped': return new Ped(data);
                case 'Ply': return new Ply(data);
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
            console.warn('makeNullable', data.type);
            if (data.object)
                console.warn('Data', data.type, 'already has object2');
            let object = factory(data);
            if (!object)
                console.warn('Object2 not typable');
            return object || null;
        }
        Objects.makeNullable = makeNullable;
        function relocate(object) {
            let chunk = Datas$1.getChunk(object.data);
            if (chunk != object.chunk) {
                object.chunk._remove(object.data);
                chunk._add(object.data);
            }
        }
        Objects.relocate = relocate;
    })(Objects || (Objects = {}));
    var Objects$1 = Objects;

    // A chunk makes / destroys its datas / objects
    class Chunk {
        constructor(w) {
            this.isActive = false;
            console.log(`chunk`, Points$1.string(w));
            this.group = new THREE.Group;
            this.w = w;
            this.datas = [];
            this.objects = [];
            //Chunks.scaffold(this);
        }
        fabricate(data) {
            if (!data.object)
                Objects$1.makeNullable(data);
            if (data.object) {
                data.object.chunk = this;
                this.objects.push(data.object);
            }
        }
        _update() {
            for (let object of this.objects)
                object.update();
        }
        _add(data) {
            console.log('add', data.type);
            this.datas.push(data);
            if (this.isActive)
                this.fabricate(data);
        }
        _remove(data) {
            let i;
            i = this.datas.indexOf(data);
            if (i >= 0)
                this.datas.splice(i, 1);
            if (data.object) {
                i = this.objects.indexOf(data.object);
                if (i >= 0)
                    this.objects.splice(i, 1);
                data.object.chunk = undefined;
            }
        }
        unearth() {
            this.isActive = true;
            for (let data of this.datas)
                this.fabricate(data);
            Four$1.scene.add(this.group);
        }
        hide() {
            for (let object of this.objects)
                object.destroy();
            this.objects.length = 0; // Reset array
            this.isActive = false;
            Four$1.scene.remove(this.group);
        }
    }
    Chunk._tileSpan = 7; // use Chunks.tileSpan

    // Simple getters and chunk creation
    class ChunkList {
        constructor() {
            this.dict = {};
        }
        key(w) {
            return `${w.x} & ${w.y}`;
        }
        getNullable(w) {
            let z = this.key(w);
            let chunk = this.dict[z];
            return chunk || null;
        }
        get2(x, y) {
            return this.getCreate({ x: x, y: y });
        }
        getCreate(w) {
            let z = this.key(w);
            let chunk = this.dict[z];
            if (!chunk) {
                chunk = new Chunk(w);
                this.dict[z] = chunk;
            }
            return chunk;
        }
    }

    class City {
        constructor() {
            this.chunks = [];
            this.chunkList = new ChunkList;
            this.new = Points$1.make(0, 0);
            this.old = Points$1.make(100, 100);
        }
        shift(p) {
            this.new = Datas$1.big(p);
            if (Points$1.same(this.new, this.old))
                return;
            this.old = Points$1.copy(this.new);
            this.off();
            this.on();
        }
        update() {
            for (let chunk of this.chunks) {
                chunk._update();
            }
        }
        // Find chunks outside the wide span
        // and turn them off with a negative for-loop
        off() {
            const to = this.new;
            let i = this.chunks.length;
            while (i--) {
                let ch = this.chunks[i];
                if (!Chunks$1.vis(ch, to)) {
                    this.chunks.splice(i, 1);
                    ch.hide();
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
                    let ch = this.chunkList.getCreate(z);
                    if (!ch.isActive) {
                        this.chunks.push(ch);
                        ch.unearth();
                        Chunks$1.vis(ch, to);
                    }
                }
            }
        }
    }
    City.spanUneven = 5;

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
    var Cameraz;
    (function (Cameraz) {
        Cameraz.dontZoom = false;
        Cameraz.allowManual = true;
        Cameraz.stage = 2;
        Cameraz.stages = [150, 300, 600, 1200, 2400];
        Cameraz.zoomCur = 600;
        Cameraz.zoomTarget = 600;
        Cameraz.zoom = 600;
        let t = 0;
        Cameraz.ZOOMDUR = 1;
        function set2(target) {
            t = 0;
            Cameraz.zoomTarget = target;
            Cameraz.zoomCur = Four$1.camera.position.z;
            Cameraz.dontZoom = false;
        }
        Cameraz.set2 = set2;
        function set(st) {
            t = 0;
            Cameraz.zoomCur = Cameraz.zoom;
            Cameraz.stage = st;
        }
        Cameraz.set = set;
        function update() {
            const z = App.map[90] == 1;
            if (z && Cameraz.allowManual) {
                Cameraz.dontZoom = false;
                t = 0;
                Cameraz.zoomCur = Cameraz.zoom;
                Cameraz.stage =
                    Cameraz.stage < Cameraz.stages.length - 1 ? Cameraz.stage + 1 : 0;
                Cameraz.zoomTarget = Cameraz.stages[Cameraz.stage];
                console.log('z stage', Cameraz.stage);
            }
            if (Cameraz.dontZoom)
                return;
            t += Four$1.delta / Cameraz.ZOOMDUR;
            t = Math.min(Math.max(t, 0.0), 1.0);
            const difference = Cameraz.zoomTarget - Cameraz.zoomCur;
            const T = EasingFunctions$1.inOutCubic(t);
            Cameraz.zoom = Cameraz.zoomCur + (T * difference);
            const data = KILL$1.view;
            Four$1.camera.position.set(data.x * 64, data.y * 64, Cameraz.zoom);
        }
        Cameraz.update = update;
    })(Cameraz || (Cameraz = {}));
    var Cameraz$1 = Cameraz;

    const TWO = THREE__default;
    var Shift;
    (function (Shift) {
        Shift.enabled = true;
        function cityView() {
            Cameraz$1.set(2);
            Shift.effect.uniforms["pixelSize"].value = 1.0;
            Shift.effect.uniforms["zoom"].value = 0.0;
        }
        Shift.cityView = cityView;
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
            let x = Math.sin(strawberry);
            let y = Math.cos(orange) / 2;
            let z = Math.sin(meat) + 1 / 4;
            Shift.effect.uniforms['angle'].value = x * strawberry;
            Shift.effect.uniforms['redblue'].value = y * z * 0.0045;
        }
        Shift.update = update;
        let bat = 0;
        function updateHyper() {
            bat = cart(bat, 5);
            Shift.effect.uniforms['angle'].value = bat;
            Shift.effect.uniforms['redblue'].value = bat * 0.5;
        }
        Shift.updateHyper = updateHyper;
        function resize() {
            Shift.effect.uniforms["resolution"].value.set(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio);
        }
        Shift.resize = resize;
        function init() {
            Shift.composer = new TWO.EffectComposer(Four$1.renderer);
            Shift.renderPass = new TWO.RenderPass(Four$1.scene, Four$1.camera);
            Shift.composer.addPass(Shift.renderPass);
            Shift.effect = new TWO.ShaderPass(Shift.retroShader);
            Shift.effect.uniforms['redblue'].value = 0.0015 * 0.5;
            Shift.effect.uniforms["resolution"].value =
                new THREE.Vector2(window.innerWidth, window.innerHeight);
            Shift.effect.uniforms["resolution"].value.multiplyScalar(window.devicePixelRatio);
            Shift.effect.renderToScreen = true;
            Shift.composer.addPass(Shift.effect);
        }
        Shift.init = init;
        Shift.retroShader = {
            uniforms: {
                "tDiffuse": { value: null },
                "tUI": { value: null },
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
			uniform sampler2D tUI;
			uniform float redblue;
			uniform float angle;
			
			varying vec2 vUv;

			vec4 siift(sampler2D texture) {
				vec2 offset = redblue * vec2( cos(angle), sin(angle));
				
				vec4 cr = texture2D(texture, vUv + offset);
				vec4 cga = texture2D(texture, vUv);
				vec4 cb = texture2D(texture, vUv - offset);

				return vec4(cr.r, cga.g, cb.b, cga.a);
			}

			void main() {

				vec4 a = siift(tDiffuse);
				vec4 b = siift(tUI);

				gl_FragColor = a + b;
			}`
        };
    })(Shift || (Shift = {}));

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
        ccw(n = 1) {
            this.findExtents();
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
                    data.f = true;
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
                    data.f = true;
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
                        block.f = true;
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
                        block.f = true;
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
                            road.f = true;
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
                        let randomCar = parkedCarNames[KILL$1.floor_random(parkedCarNames.length)];
                        let parkedCar = {
                            type: 'Car',
                            car: randomCar,
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
                                    road.f = true;
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
                        let randomCar = parkedCarNames[KILL$1.floor_random(parkedCarNames.length)];
                        let parkedCar = {
                            type: 'Car',
                            car: randomCar,
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
                            pav.r = KILL$1.floor_random(4);
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
            Scenarios.current.loadCb();
        }
        Scenarios.load = load;
        function update() {
            if (Scenarios.current)
                Scenarios.current.updateCb();
        }
        Scenarios.update = update;
    })(Scenarios || (Scenarios = {}));
    var Scenarios$1 = Scenarios;

    // we use canvas now tho
    class Widget {
        constructor(pos) {
            this.scale = 1;
            console.log('ui element');
            this.pos = pos;
            this.make();
        }
        destroy() {
            this.geometry.dispose();
            this.material.dispose();
        }
        toggle(see = false) {
            this.mesh.visible = see;
        }
        make() {
            this.material = new THREE.MeshBasicMaterial({
                map: Util$1.loadTexture(`sty/a square.png`),
                transparent: true,
                depthTest: false
            });
            this.geometry = new THREE.PlaneBufferGeometry(this.pos.w, this.pos.h, 1);
            const scale = 1;
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.renderOrder = 2;
            this.mesh.scale.set(scale, scale, scale);
            this.update();
            console.log('adding ui element');
            Four$1.scene.add(this.mesh);
        }
        update() {
            let cam = Four$1.camera.position.clone();
            // x / y range to -500 to 500
            let x = cam.x + this.pos.x; // * Four.aspect;
            let y = cam.y + this.pos.y; // * Four.aspect;
            let z = cam.z + this.pos.z - 680; // magic number
            const scale = this.scale; ///Four.aspect;
            this.mesh.position.set(x, y, z);
            this.mesh.scale.set(scale, scale, scale);
        }
    }
    window.Widget = Widget;

    // Apparently a band
    class TalkingHead {
        constructor(name) {
            this.t = .11;
            this.speed = 0.19;
            this.limit = 0;
            this.wordsSpoken = 0;
            this.blink = true;
            this.blinkDelay = 2;
            this.openEyesDelay = 0.1;
            this.img = 0;
            this.imgs = [];
            this.talk = false;
            console.log('new talking head');
            this.imgs.push(Util$1.loadTexture(`sty/talking heads/${name}_1.png`));
            this.imgs.push(Util$1.loadTexture(`sty/talking heads/${name}_2.png`));
            this.imgs.push(Util$1.loadTexture(`sty/talking heads/${name}_3.png`));
            //Sheets.center(`sty/talking heads/${name}_1.bmp`);
            this.make();
        }
        set_speed(speed = 0.2) {
            this.speed = speed;
        }
        speak_after(after = 20) {
            setTimeout(() => {
                this.t = 0;
                this.talk = true;
                this.wordsSpoken = 0;
            }, after);
        }
        set_shock_after(after = 20) {
            setTimeout(() => this.img = 2, after);
        }
        quiet_after(after = 20) {
            setTimeout(() => {
                this.talk = false;
                this.img = 0;
            }, after);
        }
        // uneven to keep mouth open
        set_limit(words = 0) {
            this.limit = words;
            this.wordsSpoken = 0;
        }
        disappear_after(after = 20) {
            setTimeout(() => {
                this.widget.mesh.visible = false;
            }, after);
        }
        should_blink(so) {
            this.blink = so;
        }
        destroy() {
            this.widget.destroy();
        }
        make() {
            this.widget = new Widget({ x: 350, y: -200, z: 0, w: 200, h: 200 });
            this.widget.scale = 1.5;
        }
        update() {
            if (this.talk) {
                this.t += Four$1.delta;
                if (this.t > this.speed) {
                    if (!this.limit || this.wordsSpoken < this.limit) {
                        this.img = this.img < 2 ? this.img + 2 : 0;
                        this.t = 0;
                        this.wordsSpoken++;
                    }
                }
            }
            else if (this.blink) {
                this.t += Four$1.delta;
                if (this.t > this.blinkDelay) {
                    this.t = 0;
                    this.blinkDelay = 2 + Math.random() * 2;
                }
                else if (this.t > 0.11) {
                    this.img = 0;
                }
                else if (this.t > 0) {
                    this.img = 1;
                }
            }
            this.widget.material.map = this.imgs[this.img];
            this.widget.update();
            const s = 10;
            if (App.map[39]) // right
                this.widget.pos.x += s;
            if (App.map[37]) // left
                this.widget.pos.x -= s;
            if (App.map[38]) // up
                this.widget.pos.y += s;
            if (App.map[40]) // down
                this.widget.pos.y -= s;
            //console.log(this.widget.pos);
        }
    }
    window.TalkingHead = TalkingHead;

    var FontsSpelling;
    (function (FontsSpelling) {
        function symbol(a, b, c, d, e, f, g, h) {
            return { char: a, x: b, y: c, x2: d, y2: e, w: f, h: g, colorize: h };
        }
        const characters = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ',
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
            '.', ',', '?', '!',
            ';', '~', '\'', '"', '$', '(', ')', '-', '_'
        ];
        const typefaces = {
            small: {
                positions: [
                    0, 11, 22, 33, 44, 55, 66, 77, 88, 96, 108, 121, 132, 148,
                    //A B  C   D   E   F   G   H   I   J   K    L    M    N
                    159, 170, 181, 192, 203, 214, 224, 235, 247, 263, 274, 286, 296,
                    //O  P    Q    R    S    T    U    V    W    X    Y    Z
                    304, 313, 325, 337, 350, 362, 374, 386, 398, 410,
                    //1  2    3    4    5    6    7    8    9    0    
                    422, 429, 435, 446,
                    //.  ,    ?    !
                    452, 458, 471, 477, 488, 500, 509, 518, 529, 540
                    //;  ~    '    "    $    (    )    -    _
                ],
                space: 9,
                line_height: 23,
            },
            mission: {
                positions: [],
                space: 33,
                line_height: 64,
            }
        };
        // https://gtamp.com/text/?bg=0&font=1&color=6&shiny=0&imgtype=0&text=ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890.%2C%3F%21%3B%7E%27%22%60%24%28%29-
        function symbolize(canvas, text, font) {
            let typeface = typefaces[font];
            text = text.toUpperCase();
            let last_x = 0;
            let last_y = canvas.height / 2 - typeface.line_height;
            let symbols = [];
            let colorize = false;
            for (let i = 0; i < text.length; i++) {
                let char = text[i];
                if (' ' == char) {
                    last_x += typeface.space;
                    continue;
                }
                if ('\n' == char) {
                    last_y += typeface.line_height;
                    last_x = 0;
                    continue;
                }
                if ('#' == char) {
                    colorize = !colorize;
                    continue;
                }
                let index = characters.indexOf(char);
                if (index == -1)
                    continue;
                let x = typeface.positions[index];
                let y = 0;
                let w = typeface.positions[index + 1] - x;
                symbols.push(symbol(char, last_x, last_y, x, y, w, typeface.line_height, colorize));
                last_x += w;
            }
            return symbols;
        }
        FontsSpelling.symbolize = symbolize;
    })(FontsSpelling || (FontsSpelling = {}));
    var FontsSpelling$1 = FontsSpelling;

    var Fonts;
    (function (Fonts) {
        Fonts.fonts = {
            white: undefined,
            yellow: undefined,
            mission: undefined
        };
        function init() {
            Fonts.canvas = document.createElement('canvas');
            console.log('fonts init');
            load();
        }
        Fonts.init = init;
        function load() {
            const get_font = (name, rs, func) => {
                new THREE.ImageLoader().load(`sty/fonts/${name}.png`, (img) => {
                    func(img);
                    KILL$1.resourced(rs);
                }, () => { }, () => KILL$1.critical(rs));
            };
            get_font(`white`, `FONT_WHITE`, (e) => Fonts.fonts.white = e);
            get_font(`yellow`, `FONT_YELLOW`, (e) => Fonts.fonts.yellow = e);
            get_font(`mission`, `FONT_MISSION`, (e) => Fonts.fonts.mission = e);
        }
        function textOnto(inCanvas, text, width, height) {
            let symbols = FontsSpelling$1.symbolize(inCanvas, text, 'small');
            const context = inCanvas.getContext("2d");
            for (let s of symbols) {
                let font = s.colorize ? Fonts.fonts.yellow : Fonts.fonts.white;
                context.drawImage(font, s.x2, s.y2, s.w, s.h, s.x, s.y, s.w, s.h);
            }
        }
        Fonts.textOnto = textOnto;
        function textTexture(text, width, height) {
            Fonts.canvas.width = width;
            Fonts.canvas.height = height;
            let symbols = FontsSpelling$1.symbolize(Fonts.canvas, text, 'small');
            let texture = new THREE.CanvasTexture(Fonts.canvas);
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            const context = Fonts.canvas.getContext("2d");
            for (let s of symbols) {
                let font = s.colorize ? Fonts.fonts.yellow : Fonts.fonts.white;
                context.drawImage(font, s.x2, s.y2, s.w, s.h, s.x, s.y, s.w, s.h);
            }
            texture.needsUpdate = true;
            return texture;
        }
        Fonts.textTexture = textTexture;
    })(Fonts || (Fonts = {}));
    var Fonts$1 = Fonts;

    class WordBox {
        constructor() {
            this.make();
        }
        destroy() {
            this.widget.destroy();
        }
        make() {
            this.widget = new Widget({
                x: 250,
                y: -250,
                z: 0,
                w: 512,
                h: 128
            });
            this.widget.scale = 3;
            this.widget.material.map = this.texture;
            console.log('make word box');
        }
        setText(text, delay = 650) {
            if (this.texture)
                this.texture.dispose();
            this.texture = Fonts.textTexture(text, 512, 128);
            //if (this.mesh) {
            this.widget.material.map = this.texture;
            this.widget.mesh.visible = false;
            setTimeout(() => {
                this.widget.mesh.visible = true;
            }, delay);
            //}
        }
        update() {
            this.widget.update();
            //let pos = Four.camera.position.clone();
            //let x = pos.x + 100 * Four.aspect;
            //let y = pos.y - 80;
            //let z = pos.z - 200;
            //this.mesh.position.set(x, y, z);
            //this.meshShadow.position.set(x + 1, y - 1, z);
        }
    }
    window.WordBox = WordBox;

    var GenTools;
    (function (GenTools) {
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
        GenTools.getDataOfType = getDataOfType;
        function swap2(min, assign) {
            swap(min, min, assign);
        }
        GenTools.swap2 = swap2;
        function swap(min, max, assign) {
            let x = min[0];
            for (; x <= max[0]; x++) {
                let y = min[1];
                for (; y <= max[1]; y++) {
                    let point = Points$1.make(x, y);
                    let chunk = Datas$1.getChunk(point);
                    for (let data of chunk.datas) {
                        if (Points$1.different(data, point))
                            continue;
                        //data.color = 'pink';
                        Object.assign(data, assign);
                        // Rebuild idiom
                        chunk._remove(data);
                        chunk._add(data);
                    }
                }
            }
        }
        GenTools.swap = swap;
        let Deline;
        (function (Deline) {
            function simple(w, width, height) {
                let x = 0;
                for (; x < width; x++) {
                    let y = 0;
                    for (; y < height; y++) {
                        let point = Points$1.make(w[0] + x, w[1] + y);
                        let chunk = Datas$1.getChunk(point);
                        for (let data of chunk.datas) {
                            if ('Surface' != data.type)
                                continue;
                            if (Points$1.different(data, point))
                                continue;
                            if (data.sprite == Sprites$1.ROADS.SIDE_LINE) {
                                data.sprite = Sprites$1.ROADS.SIDE_CLEAR;
                            }
                            if (data.sprite == Sprites$1.ROADS.CONVEX_LINE)
                                data.sprite = Sprites$1.ROADS.CONVEX;
                            if (data.sprite == Sprites$1.ROADS.SIDE_STOP_LINE) {
                                data.sprite = Sprites$1.ROADS.SIDE_STOP;
                            }
                        }
                    }
                }
            }
            Deline.simple = simple;
            function aabb(min, max, axis) {
                horz(min, max[0] - min[0], max[1] - min[1], axis);
            }
            Deline.aabb = aabb;
            function horz(w, width, height, axis) {
                let x = 0;
                for (; x < width; x++) {
                    let y = 0;
                    for (; y < height; y++) {
                        let p = { x: w[0] + x, y: w[1] + y };
                        let chunk = Datas$1.getChunk(p);
                        //if (chunked.includes(chunk))
                        //continue;
                        //chunked.push(chunk);
                        for (let data of chunk.datas) {
                            if ('Surface' != data.type)
                                continue;
                            if (Points$1.different(data, p))
                                continue;
                            //data.color = 'red';
                            if (data.sprite == Sprites$1.ROADS.SIDE_LINE) {
                                data.sprite = Sprites$1.ROADS.SIDE_CLEAR;
                                if (axis == 0) {
                                    if (p.y == w[1] || p.y == w[1] + height - 1) {
                                        data.sprite = Sprites$1.ROADS.SIDE_DASH;
                                        //data.color = 'pink';
                                        if ((data.r == 1) && p.y == w[1] + height - 1)
                                            data.f = true;
                                        if ((data.r == 3) && p.y == w[1])
                                            data.f = true;
                                    }
                                }
                            }
                            if (data.sprite == Sprites$1.ROADS.CONVEX_LINE)
                                data.sprite = Sprites$1.ROADS.CONVEX;
                            if (data.sprite == Sprites$1.ROADS.SIDE_STOP_LINE) {
                                data.sprite = Sprites$1.ROADS.SIDE_STOP;
                            }
                        }
                    }
                }
            }
            Deline.horz = horz;
        })(Deline = GenTools.Deline || (GenTools.Deline = {}));
    })(GenTools || (GenTools = {}));
    var GenTools$1 = GenTools;

    var PalmTrees;
    (function (PalmTrees) {
        function gas_station() {
            let offset_y = 0;
            // Fill the landscape
            // sty/nature/tracks/514.bmp
            // sty/nature/park original/216.bmp
            // sty/nature/evergreen/836.bmp - Turtoise wasteland
            Generators$1.Fill.fill([-500, -500, 0], [1000, 1000, 0], { sty: 'sty/nature/evergreen/836.bmp' }, { WHEEL: true });
            //Generators.Fill.fill([10, -25, 0], [10+1000, -25+1000, 0], {sty: 'sty/nature/tracks/512.bmp'}, {RANDOM_ROTATION: true});
            //Generators.Fill.fill([12, -25, 0], 1, 50, {r: 3, sty: 'sty/nature/evergreen/839.bmp'});
            // Side of roads:
            // 'sty/nature/evergreen/839.bmp'
            Generators$1.Fill.fill([8, -500, 0], [9, 1000, 0], { r: 1, sty: 'sty/nature/evergreen/839.bmp' });
            Generators$1.Fill.fill([9, -500, 0], [9, 1000, 0], { r: 1, sty: 'sty/floors/mixed/64.bmp' });
            Generators$1.Fill.fill([12, -500, 0], [12, 1000, 0], { r: 3, sty: 'sty/nature/evergreen/839.bmp' });
            Generators$1.Fill.fill([-25, 6, 0], [8, 6, 0], { r: 2, sty: 'sty/nature/evergreen/839.bmp' });
            Generators$1.Fill.fill1([8, 6, 0], { r: 2, sty: 'sty/nature/evergreen/852.bmp' }); // 838
            Generators$1.Fill.fill([-25, -1, 0], [8, -1, 0], { r: 0, sty: 'sty/nature/evergreen/839.bmp' });
            Generators$1.Fill.fill1([8, -1, 0], { r: 1, sty: 'sty/nature/evergreen/852.bmp' }); // 838
            // Big main road:
            Generators$1.Roads.twolane(1, [10, 0, 0], 100, 'greyRoads');
            //return;
            //Generators.Fill.fill([12, -25, 0], 1, 50, {r: 2, sty: 'sty/nature/tracks/520.bmp'});
            Generators$1.Roads.oneway(0, [2, 5, 0], 9, 'greyRoads'); // Parking entry
            Generators$1.Roads.oneway(0, [7, 0, 0], 4, 'greyRoads'); // Parking exit
            // Deco in between road and parking
            Generators$1.Fill.fill([8, 1 + offset_y, 0], [9, 4 + offset_y, 0], { r: 0, sty: 'sty/floors/mixed/64.bmp' });
            //Generators.Fill.fill([9, 1, 0], [9, 4, 0], { r: 1, sty: 'sty/nature/evergreen/836.bmp' });
            // Turq evergreen planter
            //Generators.Fill.fill1([9, 1, 0], { r: 2, sty: 'sty/nature/evergreen/840.bmp' });
            //Generators.Fill.fill1([9, 2, 0], { r: 2, sty: 'sty/nature/evergreen/859.bmp' });
            //Generators.Fill.fill1([9, 3, 0], { r: 2, sty: 'sty/nature/evergreen/859.bmp' });
            //Generators.Fill.fill1([9, 4, 0], { r: 0, sty: 'sty/nature/evergreen/840.bmp' });
            // Deline exits
            //GenTools.Deline.horz([2, 4, 0], 10, 3, 0);
            //GenTools.Deline.horz([2, -1, 0], 9, 3, 0);
            //GenTools.Deline.aabb([2, -1, 0], [2, 4+10, 0+9], 0);
            GenTools$1.Deline.aabb([9, -1 + offset_y, 0], [13, 7 + offset_y, 0], 0); // Deline success
            //Generators.Fill.fill([6, 0, 0], [6, 4, 0], { r: 3, sty: 'sty/floors/yellow/933.bmp' }, { WHEEL: false });
            Generators$1.Fill.fill([6, 0 + offset_y, 0], [6, 4 + offset_y, 0], { r: 1, sty: 'sty/floors/mixed/64.bmp' }, { WHEEL: true });
            // Gas station
            Generators$1.Interiors.generate([3, 0 + offset_y, 0], [5, 4 + offset_y, 0], 'green');
            //Generators.Buildings.type1([3, 0, 0], [5, 4, 0]); // Gas station
            //Gen1.GenRoads.highway(1, [5, 0, 0], 6, 2, 'greyRoads'); // Pumps road
            //Gen1.GenRoads.twolane(0, [2, 5, 0], 9, 'greenRoads'); // horz
            //Gen1.GenRoads.twolane(0, [2, -2, 0], 9, 'greenRoads'); // horz
            //GenDeline.mixedToBad([2, 4, 0], 9, 4);
            //GenDeline.mixedToBad([2, -3, 0], 9, 4);
            Generators$1.Parking.onewayRight([7, 0 + offset_y, 0], 6, 2, 'greyRoads');
            //GenTools.swap([7, 1, 0], [7, 4, 0], { sheet: 'badRoads' });
            //GenTools.swap([6, 2, 0], [6, 3, 0], { sheet: 'badRoads'} );
            //Gen2.GenDeline.horz([4, 0, 0], 6, 6);
            let gas_station_corner = GenTools$1.getDataOfType([7, 5 + offset_y, 0], 'Surface');
            let gas_station_corner2 = GenTools$1.getDataOfType([7, 0 + offset_y, 0], 'Surface');
            gas_station_corner.sprite = Sprites$1.ROADS.SINGLE_EXIT;
            gas_station_corner2.sprite = Sprites$1.ROADS.SINGLE_CORNER;
            gas_station_corner2.r += 1;
        }
        function init() {
            console.log('Palm trees init');
            let ply;
            let cat;
            let dog;
            const load = function () {
                //Generators.Fill.fill([-500, -500, -3], [1000, 1000, 0], { sty: 'sty/special/water/1.bmp' }, { WHEEL: false });
                //Generators.Roads.twolane(1, [10, -ROADS + 10, 0], ROADS, 'greyRoads');
                gas_station();
                let randomCar = Cars$1.Names2[KILL$1.floor_random(Cars$1.Names2.length)];
                cat = {
                    type: 'Car',
                    car: randomCar,
                    spray: KILL$1.floor_random(Cars$1.Sprays.YELLOW_GREEN),
                    x: 10.5,
                    y: 97,
                    z: 0
                };
                Datas$1.deliver(cat);
                dog = {
                    type: 'Car',
                    car: 'Van',
                    spray: Cars$1.Sprays.PINK_RED,
                    x: 10.5,
                    y: 3,
                    z: 0
                };
                Datas$1.deliver(dog);
                Four$1.camera.position.z = 60;
                Cameraz$1.allowManual = false;
                Cameraz$1.set2(100);
                Cameraz$1.ZOOMDUR = 20;
                console.log('loaded palm trees');
            };
            let stage = 0;
            let swerveAt = 0;
            let swerve;
            let carSpeed = 0.14;
            let gaveLights = false;
            let brakeHard = false;
            let zoomCrash = false;
            let lookAhead = 50;
            let makeTh = true;
            let talkingHead;
            let wordBox;
            const update = function () {
                let car = cat.object;
                let van = dog.object;
                if (stage == 0) {
                    KILL$1.view = cat;
                    KILL$1.city.shift(cat);
                    cat.y -= carSpeed;
                    if (makeTh) {
                        talkingHead = new TalkingHead('elmo');
                        talkingHead.speak_after(900);
                        talkingHead.quiet_after(8000);
                        wordBox = new WordBox();
                        wordBox.setText(`Blah blah\nblah`, 1000);
                        makeTh = false;
                    }
                    if (car && !gaveLights) {
                        gaveLights = true;
                        let f;
                        //car.add_delta(Cars.deltaSquares.tail_light_left);
                        //f = car.add_delta(Cars.deltaSquares.tail_light_right);
                        //f.mesh.scale.set(-1, 1, 1);
                        car.add_delta(Cars$1.deltaSquares.head_light_left);
                        f = car.add_delta(Cars$1.deltaSquares.head_light_right);
                        f.mesh.scale.set(-1, 1, 1);
                    }
                    if (--swerveAt <= 0) {
                        let r = (Math.random() - 0.5) / 12;
                        let p = Points$1.make(cat.x + r, cat.y - lookAhead);
                        swerve = p;
                        swerveAt = 10 + Math.random() * 15;
                    }
                    let theta = Math.atan2(cat.y - swerve.y, cat.x - swerve.x);
                    let newr = theta - Math.PI / 2;
                    cat.r = newr;
                    cat.x += Math.cos(theta - Math.PI);
                    //if (car && my_car.y < -10) {
                    //	my_car.z += 2;
                    //}
                    if (!brakeHard && car && cat.y < dog.y + 25) {
                        brakeHard = true;
                        wordBox.setText("Oh no!\n...", 0);
                        talkingHead.should_blink(false);
                        talkingHead.set_speed(0.13);
                        talkingHead.set_limit(4);
                        talkingHead.speak_after(0);
                        talkingHead.disappear_after(2500);
                        talkingHead.set_shock_after(1200);
                        //talkingHead.widget.toggle();
                        lookAhead = 70;
                        Cameraz$1.set2(150);
                        Cameraz$1.ZOOMDUR = 3;
                    }
                    if (brakeHard) {
                        carSpeed -= 0.01 * Four$1.delta;
                    }
                    if (car && cat.y < dog.y + 1) {
                        car.add_delta(Cars$1.deltaSquares.dent_front_left);
                        car.add_delta(Cars$1.deltaSquares.dent_front_right);
                        van.add_delta(Cars$1.deltaSquares.dent_behind_left);
                        van.add_delta(Cars$1.deltaSquares.dent_behind_right);
                        stage = 1;
                    }
                    let w = Points$1.real_space(cat);
                    Four$1.camera.position.x = w.x;
                    Four$1.camera.position.y = w.y;
                }
                else if (stage == 1) {
                    let w = Points$1.real_space(cat);
                    if (KILL$1.view == cat) {
                        Four$1.camera.position.x = w.x;
                        Four$1.camera.position.y = w.y;
                    }
                    if (!zoomCrash) {
                        ply = {
                            type: 'Ply',
                            //remap: 16,
                            x: cat.x + .3,
                            y: cat.y,
                            z: 0
                        };
                        KILL$1.view = ply;
                        Cameraz$1.allowManual = true;
                        Cameraz$1.ZOOMDUR = 2;
                        Datas$1.deliver(ply);
                        //Cameraz.set2(200);
                        //Cameraz.ZOOMDUR = 3;
                        zoomCrash = true;
                    }
                }
                if (talkingHead)
                    talkingHead.update();
                if (wordBox)
                    wordBox.update();
            };
            let palmTrees = {
                name: 'Palm Trees',
                loadCb: load,
                updateCb: update
            };
            Scenarios.load(palmTrees);
        }
        PalmTrees.init = init;
    })(PalmTrees || (PalmTrees = {}));
    var PalmTrees$1 = PalmTrees;

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
                for (let name of Cars$1.Names2) {
                    let physics = APhysic$1.get(name);
                    const apartness = 15;
                    let half_size = (physics.x_img_height + apartness) / 2 / 64;
                    y -= half_size;
                    let car = {
                        type: 'Car',
                        car: name,
                        spray: KILL$1.floor_random(35),
                        x: 10 + x,
                        y: y + 7,
                        z: 0
                    };
                    y -= half_size;
                    j++;
                    if (j > 16) {
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
                    wordBox.setText(`The highway has every car.\nI will tell you which.`, 1000);
                    setTimeout(() => stage++, 5000);
                    stage++;
                }
                else if (stage == 2) {
                    let chunk = Datas$1.getChunk(KILL$1.ply.data);
                    const carArray = Cars$1.getCars();
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
                        let d = closestCar.data;
                        wordBox.setText(`${d.car},\n${Cars$1.getSpray(d.spray)} ${d.spray}`);
                    }
                }
                talkingHead.update();
                wordBox.update();
            };
            let highwayWithEveryCar = {
                name: 'Highway with every car',
                loadCb: load,
                updateCb: update
            };
            Scenarios.load(highwayWithEveryCar);
        }
        HighWayWithEveryCar.init = init;
    })(HighWayWithEveryCar || (HighWayWithEveryCar = {}));
    var HighWayWithEveryCar$1 = HighWayWithEveryCar;

    // http://kitfox.com/projects/perlinNoiseMaker/
    var Mist;
    (function (Mist) {
        function init() {
            return;
        }
        Mist.init = init;
        function update() {
            return;
        }
        Mist.update = update;
    })(Mist || (Mist = {}));
    var Mist$1 = Mist;

    var YM;
    (function (YM) {
        function init() {
            console.log('ym init');
            YM.canvas = document.createElement('canvas');
            document.body.appendChild(YM.canvas);
            YM.context = YM.canvas.getContext("2d");
            YM.canvasTexture = new THREE.CanvasTexture(YM.canvas);
            YM.canvasTexture.magFilter = THREE.NearestFilter;
            YM.canvasTexture.minFilter = THREE.NearestFilter;
            //Shift.effect.uniforms['tUI'].value = canvasTexture;
            resize();
            refresh();
        }
        YM.init = init;
        function resize() {
            YM.canvas.width = window.innerWidth;
            YM.canvas.height = window.innerHeight;
        }
        YM.resize = resize;
        let firstUpdate = true;
        function update() {
            if (firstUpdate) {
                console.log('first update');
                YM.canvasTexture.needsUpdate = true;
                firstUpdate = false;
            }
        }
        YM.update = update;
        function refresh() {
            //context.drawImage(
            //font, s.x2, s.y2, s.w, s.h, s.x, s.y, s.w, s.h);
            YM.canvasTexture.needsUpdate = true;
        }
        YM.refresh = refresh;
        function drawth(th) {
            //context.fillStyle = 'rgba(255, 0, 255, 1)';
            //context.fillRect(0, 0, 100, 100);
            //Fonts.textOnto(canvas, "Bearing too much weight, will eventually cause the collapse of everything.", 512, 128);
            //context.drawImage(, s.x2, s.y2, s.w, s.h, s.x, s.y, s.w, s.h);
        }
        YM.drawth = drawth;
    })(YM || (YM = {}));
    var YM$1 = YM;

    var KILL;
    (function (KILL) {
        var started = false;
        function floor_random(n) {
            return Math.floor(Math.random() * n);
        }
        KILL.floor_random = floor_random;
        let RESOURCES;
        (function (RESOURCES) {
            RESOURCES[RESOURCES["UNDEFINED_OR_INIT"] = 0] = "UNDEFINED_OR_INIT";
            RESOURCES[RESOURCES["FONT_WHITE"] = 1] = "FONT_WHITE";
            RESOURCES[RESOURCES["FONT_YELLOW"] = 2] = "FONT_YELLOW";
            RESOURCES[RESOURCES["FONT_MISSION"] = 3] = "FONT_MISSION";
            RESOURCES[RESOURCES["SPRITES"] = 4] = "SPRITES";
            RESOURCES[RESOURCES["COUNT"] = 5] = "COUNT";
        })(RESOURCES = KILL.RESOURCES || (KILL.RESOURCES = {}));
        let resources_loaded = 0b0;
        function resourced(word) {
            resources_loaded |= 0b1 << RESOURCES[word];
            try_start();
        }
        KILL.resourced = resourced;
        function try_start() {
            let count = 0;
            let i = 0;
            for (; i < RESOURCES.COUNT; i++)
                (resources_loaded & 0b1 << i) ? count++ : void (0);
            if (count == RESOURCES.COUNT)
                start();
        }
        function critical(mask) {
            // Couldn't load
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
            Chunks$1.init();
            Cars$1.init();
            Sprites$1.init();
            Sheets$1.init();
            Fonts$1.init();
            Water$1.init();
            Mist$1.init();
            Shift.init();
            YM$1.init();
            KILL.city = new City;
            window.KILL = KILL;
        }
        KILL.init = init;
        function start() {
            if (started)
                return;
            console.log('kill starting');
            started = true;
            if (window.location.href.indexOf("#highway") != -1)
                HighWayWithEveryCar$1.init();
            //else if (window.location.href.indexOf("#palmtrees") != -1)
            else
                PalmTrees$1.init();
            //else
            //BridgeScenario.init();
            let data = {
                type: 'Ply',
                //remap: 16,
                x: 10.5,
                y: 1,
                z: 0
            };
            KILL.view = data;
            Datas$1.deliver(data);
            //data.remap = [40, 46, 47, 49, 50, 51][Math.floor(Math.random() * 6)];
            KILL.city.chunkList.get2(0, 0);
            KILL.city.chunkList.get2(0, 1);
        }
        KILL.start = start;
        function update() {
            if (!started)
                return;
            if (KILL.ply)
                KILL.ply.manual_update();
            YM$1.update();
            Water$1.update();
            Mist$1.update();
            Cameraz$1.update();
            Scenarios$1.update();
            KILL.city.shift(KILL.view);
            KILL.city.update();
        }
        KILL.update = update;
    })(KILL || (KILL = {}));
    var KILL$1 = KILL;

    //export { THREE };
    var Four;
    (function (Four) {
        Four.delta = 0;
        Four.aspect = 0;
        function update() {
            Four.delta = Four.clock.getDelta();
            Four.delta = Math.max(0.007, Math.min(Four.delta, 0.033)); // cap 30 - 144 fps
            KILL$1.update();
            if (App.map[115] == 1)
                Shift.enabled = !Shift.enabled;
            if (Shift.enabled) {
                Shift.update();
                Shift.composer.render();
            }
            else
                Four.renderer.render(Four.scene, Four.camera);
        }
        Four.update = update;
        function init() {
            console.log('four init');
            Four.clock = new THREE.Clock();
            Four.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
            Four.aspect = Four.camera.aspect;
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
            Four.aspect = Four.camera.aspect = window.innerWidth / window.innerHeight;
            Four.camera.updateProjectionMatrix();
            Shift.resize();
            YM$1.resize();
            Four.renderer.setSize(window.innerWidth, window.innerHeight);
            console.log('aspect ', Four.aspect);
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
