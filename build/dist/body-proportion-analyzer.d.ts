type Point = {
    x: number;
    y: number;
};
declare enum ReferencePoint {
    Head_Top = 0,
    Head_Bottom = 1,
    Head_Left = 2,
    Head_Right = 3,
    PubicBone = 4,
    Heel = 5
}
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
declare const paste_createImage: (canvas: HTMLCanvasElement, source: string, resize: boolean) => void;
declare const paste_process: (e: ClipboardEvent, window: Window & typeof globalThis, canvas: HTMLCanvasElement, resize: boolean) => void;
declare const paste_setup: (window: Window & typeof globalThis, canvas: HTMLCanvasElement, resize: boolean) => void;
declare const text_update: (state: Step, referencePoints: {
    0: Point;
    1: Point;
    2: Point;
    3: Point;
    4: Point;
    5: Point;
}) => void;
declare const result_calculate_formatted: (referencePoints: {
    0: Point;
    1: Point;
    2: Point;
    3: Point;
    4: Point;
    5: Point;
}) => {
    body_pixel: string;
    leg_pixel: string;
    total_pixel: string;
    body_percent: string;
    leg_percent: string;
};
declare const result_calculate: (state: Step, referencePoints: {
    0: Point;
    1: Point;
    2: Point;
    3: Point;
    4: Point;
    5: Point;
}) => void;
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
