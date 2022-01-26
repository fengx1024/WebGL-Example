
import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/DRACOLoader.js';

export function getShaderSource(id) {
    return document.getElementById(id).textContent.replace(/^\s+|\s+$/g, '');
}
export function createShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}
export function createProgram(gl, vertexShaderId, fragmentShaderId) {
    var program = gl.createProgram();
    var vshader = createShader(gl, getShaderSource(vertexShaderId), gl.VERTEX_SHADER);
    var fshader = createShader(gl, getShaderSource(fragmentShaderId), gl.FRAGMENT_SHADER);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);

    var log = gl.getProgramInfoLog(program);
    if (log) {
        console.log(log);
    }

    log = gl.getShaderInfoLog(vshader);
    if (log) {
        console.log(log);
    }

    log = gl.getShaderInfoLog(fshader);
    if (log) {
        console.log(log);
    }
    return program;
}

export function gltfBufferToArray(gltfBuffer) {
    if (!gltfBuffer) {
        return null;
    }
    if (gltfBuffer instanceof THREE.BufferAttribute) {
        return gltfBuffer.array;
    }
    if (gltfBuffer instanceof THREE.InterleavedBufferAttribute) {
        const offset = gltfBuffer.offset;
        const itemSize = gltfBuffer.itemSize;
        const array = gltfBuffer.data.array;
        const stride = gltfBuffer.data.stride;
        const count = gltfBuffer.data.count;
        const result = [];
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < itemSize; j++) {
                result[i * itemSize + j] = array[stride * i + offset + j];
            }
        }
        return result;
    }
    console.warn('unknown', gltfBuffer);
}

export function newGltfLoader() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://threejs.org/examples/js/libs/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    return loader;
}
