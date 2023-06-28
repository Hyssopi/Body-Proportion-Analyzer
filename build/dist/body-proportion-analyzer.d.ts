/**
 * Point.
 */
type Point = {
    /**
     * X coordinate.
     */
    x: number;
    /**
     * Y coordinate.
     */
    y: number;
};
/**
 * Reference point.
 */
declare enum ReferencePoint {
    Head_Top = 0,
    Head_Bottom = 1,
    Head_Left = 2,
    Head_Right = 3,
    PubicBone = 4,
    Heel = 5
}
/**
 * Step.
 */
declare enum Step {
    Paste = 0,
    Start = 1,
    Head_Top = 2,
    Head_Bottom = 3,
    Head_Left = 4,
    Head_Right = 5,
    PubicBone = 6,
    Heel = 7,
    End = 8
}
/**
 * Create the new image and cache it.
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {string} source Paste image source.
 * @param {boolean} resize Whether to resize the canvas or not.
 */
declare const paste_createImage: (canvas: HTMLCanvasElement, source: string, resize: boolean) => void;
/**
 * Process the paste event.
 * @param {ClipboardEvent} e Clipboard event.
 * @param {Window} window Window.
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {boolean} resize Whether to resize the canvas or not.
 */
declare const paste_process: (e: ClipboardEvent, window: Window & typeof globalThis, canvas: HTMLCanvasElement, resize: boolean) => void;
/**
 * Setup paste listener.
 * @param {Window} window Window.
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {boolean} resize Whether to resize the canvas or not.
 */
declare const paste_setup: (window: Window & typeof globalThis, canvas: HTMLCanvasElement, resize: boolean) => void;
/**
 * Update texts.
 * @param {Step} state Current step state.
 * @param {{ [key in ReferencePoint]: Point }} referencePoints Reference point state.
 */
declare const text_update: (state: Step, referencePoints: {
    0: Point;
    1: Point;
    2: Point;
    3: Point;
    4: Point;
    5: Point;
}) => void;
/**
 * Calculate the formatted results.
 * @param {{ [key in ReferencePoint]: Point }} referencePoints Reference point state.
 * @returns {{string, string, string, string, string}} Calculated formatted results.
 */
declare const result_calculate_formatted: (referencePoints: {
    0: Point;
    1: Point;
    2: Point;
    3: Point;
    4: Point;
    5: Point;
}) => {
    /**
     * Body height, in pixel.
     */
    body_pixel: string;
    /**
     * Leg height, in pixel.
     */
    leg_pixel: string;
    /**
     * Total height, in pixel.
     */
    total_pixel: string;
    /**
     * Body height percent in respect to total height.
     */
    body_percent: string;
    /**
     * Leg height percent in respect to total height.
     */
    leg_percent: string;
};
/**
 * Update results on the text.
 * @param {Step} state Current step state.
 * @param {{ [key in ReferencePoint]: Point }} referencePoints Reference point state.
 */
declare const result_update: (state: Step, referencePoints: {
    0: Point;
    1: Point;
    2: Point;
    3: Point;
    4: Point;
    5: Point;
}) => void;
/**
 * Setup click.
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {{ [key in ReferencePoint]: Point }} referencePoints Reference point state.
 */
declare const click_setup: (canvas: HTMLCanvasElement, referencePoints: {
    0: Point;
    1: Point;
    2: Point;
    3: Point;
    4: Point;
    5: Point;
}) => void;
declare const button: HTMLButtonElement;
declare const canvas: HTMLCanvasElement;
declare const ctx: CanvasRenderingContext2D;
declare const referencePoints: {
    [key in ReferencePoint]: Point;
};
declare let currentStep: Step;
declare let cachedImage: HTMLImageElement;
