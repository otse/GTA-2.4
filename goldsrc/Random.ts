import Sheet from './Sprites/Sheet';

import { default as THREE, Texture, TextureLoader, NearestFilter, LinearFilter, Geometry, BufferGeometry } from 'three';

export namespace Util {

	let mem: Texture[] = [];

	export function loadTexture(path: string | undefined, salt = ''): Texture | null {

		let pepper = path + salt;

		let texture = mem[pepper];

		if (texture)
			return texture;

		texture = new TextureLoader().load(path);
		texture.name = pepper;

		texture.generateMipmaps = false;

		texture.magFilter = NearestFilter;
		texture.minFilter = NearestFilter;

		mem[pepper] = texture;

		return texture;
	}

	export namespace UV {

		// usage sc.atlases['bad_roads_atlas'].side_line

		// Workhorse function
		export function fromSheet(geometry, square: Square, sheet: Sheet): Zxcv {
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

		// broken
		export function pixelCorrection(geom, face, zxcv, halfPixel) {
			zxcv[0] += halfPixel;
			zxcv[1] += halfPixel;
			zxcv[2] -= halfPixel;
			zxcv[3] -= halfPixel;

			planarUV(geom, face, zxcv[0], zxcv[1], zxcv[2], zxcv[3]);
		}

		export function planarUV(geom, face, x, y, w, h) {

			let o = face * 8;

			let a = [x, y + h, x + w, y + h, x, y, x + w, y];

			for (let i = 0; i < 8; i++)
				geom.attributes.uv.array[o + i] = a[i];

			geom.attributes.uv.needsUpdate = true;
		}

		export function flipPlane(geom, face, flip) {

			const o = face * 8;

			const a = geom.attributes.uv.array;

			const flips = [[a[o + 0], a[o + 1], a[o + 2], a[o + 3], a[o + 4], a[o + 5], a[o + 6], a[o + 7]],
			[a[o + 2], a[o + 3], a[o + 0], a[o + 1], a[o + 6], a[o + 7], a[o + 4], a[o + 5]]];

			const yn = (flip) ? 1 : 0;

			for (let i = 0; i < 8; i++)
				geom.attributes.uv.array[o + i] = flips[yn][i];

			geom.attributes.uv.needsUpdate = true;
		}

		export function rotatePlane(geom, face, turns) {

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

		export function rotateUVs(uvs, o, turns) {

			let newy: Array<object> = new Array(o);

			newy.fill({});

			let f = o;
			let s = o + 1;

			switch (turns) {
				case 1:
					newy.push([
						{ x: uvs[f][1].x, y: uvs[f][1].y },
						{ x: uvs[s][1].x, y: uvs[s][1].y },
						{ x: uvs[f][0].x, y: uvs[f][0].y }]);
					newy.push([
						{ x: uvs[s][1].x, y: uvs[s][1].y },
						{ x: uvs[f][2].x, y: uvs[f][2].y },
						{ x: uvs[f][0].x, y: uvs[f][0].y }]);
					break;

				case 2:
					newy.push([
						{ x: uvs[s][1].x, y: uvs[s][1].y },
						{ x: uvs[s][2].x, y: uvs[s][2].y },
						{ x: uvs[s][0].x, y: uvs[s][0].y }]);
					newy.push([
						{ x: uvs[f][2].x, y: uvs[f][2].y },
						{ x: uvs[f][0].x, y: uvs[f][0].y },
						{ x: uvs[f][1].x, y: uvs[f][1].y }]);
					break;

				case 3:
					newy.push([
						{ x: uvs[f][2].x, y: uvs[f][2].y },
						{ x: uvs[f][0].x, y: uvs[f][0].y },
						{ x: uvs[s][1].x, y: uvs[s][1].y }]);
					newy.push([
						{ x: uvs[f][0].x, y: uvs[f][0].y },
						{ x: uvs[s][0].x, y: uvs[s][0].y },
						{ x: uvs[s][1].x, y: uvs[s][1].y }]);
					break;

				default: return;
			}

			/*for j in [f..s]
				for i in [0..2]
					uvs[j][i].x = newy[j][i].x
					uvs[j][i].y = newy[j][i].y*/

		}

		export function flipUVs(uvs, o, flip) {

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
	}
}

export default Util;