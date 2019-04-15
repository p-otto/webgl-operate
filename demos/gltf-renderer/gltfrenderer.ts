
import {
    Canvas,
    Context,
    GLTFLoader,
    Invalidate,
    MouseEventProvider,
    Renderer,
    Wizard,
} from 'webgl-operate';

import { Demo } from '../demo';

// tslint:disable:max-classes-per-file

class GltfRenderer extends Renderer {

    protected onInitialize(context: Context, callback: Invalidate,
        mouseEventProvider: MouseEventProvider): boolean {

        const loader = new GLTFLoader();
        /* const root = */
        loader.loadAsset('/demos/data/scene.gltf');

        return true;
    }

    protected onUninitialize(): void { }

    protected onUpdate(): boolean {
        return true;
    }

    protected onPrepare(): void { }

    protected onFrame(frameNumber: number): void { }

}

export class GltfDemo extends Demo {

    private _canvas: Canvas;
    private _renderer: GltfRenderer;

    initialize(element: HTMLCanvasElement | string): boolean {

        this._canvas = new Canvas(element, { antialias: true });
        this._canvas.controller.multiFrameNumber = 1;
        this._canvas.framePrecision = Wizard.Precision.byte;
        this._canvas.frameScale = [1.0, 1.0];

        this._renderer = new GltfRenderer();
        this._canvas.renderer = this._renderer;

        return true;
    }

    uninitialize(): void {
        this._canvas.dispose();
        (this._renderer as Renderer).uninitialize();
    }

    get canvas(): Canvas {
        return this._canvas;
    }

    get renderer(): GltfRenderer {
        return this._renderer;
    }

}
