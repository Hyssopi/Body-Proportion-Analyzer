"use strict";
/**
 * Reference point.
 */
var ReferencePoint;
(function (ReferencePoint) {
    ReferencePoint[ReferencePoint["Head_Top"] = 0] = "Head_Top";
    ReferencePoint[ReferencePoint["Head_Bottom"] = 1] = "Head_Bottom";
    ReferencePoint[ReferencePoint["Head_Left"] = 2] = "Head_Left";
    ReferencePoint[ReferencePoint["Head_Right"] = 3] = "Head_Right";
    ReferencePoint[ReferencePoint["PubicBone"] = 4] = "PubicBone";
    ReferencePoint[ReferencePoint["Heel"] = 5] = "Heel";
})(ReferencePoint || (ReferencePoint = {}));
/**
 * Step.
 */
var Step;
(function (Step) {
    Step[Step["Paste"] = 0] = "Paste";
    Step[Step["Start"] = 1] = "Start";
    Step[Step["Head_Top"] = 2] = "Head_Top";
    Step[Step["Head_Bottom"] = 3] = "Head_Bottom";
    Step[Step["Head_Left"] = 4] = "Head_Left";
    Step[Step["Head_Right"] = 5] = "Head_Right";
    Step[Step["PubicBone"] = 6] = "PubicBone";
    Step[Step["Heel"] = 7] = "Heel";
    Step[Step["End"] = 8] = "End";
})(Step || (Step = {}));
/**
 * Create the new image and cache it.
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {string} source Paste image source.
 * @param {boolean} resize Whether to resize the canvas or not.
 */
const paste_createImage = (canvas, source, resize) => {
    const ctx = canvas.getContext('2d');
    const pastedImage = new Image();
    pastedImage.src = source;
    /**
     * Draw image on canvas once the new image has been created.
     */
    pastedImage.onload = function () {
        if (resize) {
            canvas.width = pastedImage.width;
            canvas.height = pastedImage.height;
            canvas.style.width = pastedImage.width + 'px';
            canvas.style.height = pastedImage.height + 'px';
        }
        else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(pastedImage, 0, 0);
    };
    cachedImage = pastedImage;
};
/**
 * Process the paste event.
 * @param {ClipboardEvent} e Clipboard event.
 * @param {Window} window Window.
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {boolean} resize Whether to resize the canvas or not.
 */
const paste_process = (e, window, canvas, resize) => {
    if (e.clipboardData) {
        const items = e.clipboardData.items;
        if (!items) {
            return;
        }
        let isImage = false;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                const urlObj = window.URL || window.webkitURL;
                if (blob) {
                    const source = urlObj.createObjectURL(blob);
                    paste_createImage(canvas, source, resize);
                    isImage = true;
                }
            }
        }
        if (isImage) {
            e.preventDefault();
        }
    }
};
/**
 * Setup paste listener.
 * @param {Window} window Window.
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {boolean} resize Whether to resize the canvas or not.
 */
const paste_setup = (window, canvas, resize) => {
    document.addEventListener('paste', function (e) {
        paste_process(e, window, canvas, resize);
        currentStep = Step.Start;
        text_update(currentStep, referencePoints);
    }, false);
};
/**
 * Update texts.
 * @param {Step} state Current step state.
 * @param {{ [key in ReferencePoint]: Point }} referencePoints Reference point state.
 */
const text_update = (state, referencePoints) => {
    document.getElementById('step_paste').style.color = state === Step.Paste ? 'black' : 'lightgrey';
    document.getElementById('step_start').style.color = state === Step.Start ? 'black' : 'lightgrey';
    document.getElementById('step_head_top').style.color =
        state === Step.Head_Top ? 'black' : 'lightgrey';
    document.getElementById('step_head_bottom').style.color =
        state === Step.Head_Bottom ? 'black' : 'lightgrey';
    document.getElementById('step_head_left').style.color =
        state === Step.Head_Left ? 'black' : 'lightgrey';
    document.getElementById('step_head_right').style.color =
        state === Step.Head_Right ? 'black' : 'lightgrey';
    document.getElementById('step_pubicBone').style.color =
        state === Step.PubicBone ? 'black' : 'lightgrey';
    document.getElementById('step_heel').style.color = state === Step.Heel ? 'black' : 'lightgrey';
    document.getElementById('step_end').style.color = state >= Step.End ? 'black' : 'lightgrey';
    result_update(state, referencePoints);
};
/**
 * Calculate the formatted results.
 * @param {{ [key in ReferencePoint]: Point }} referencePoints Reference point state.
 * @returns {{string, string, string, string, string}} Calculated formatted results.
 */
const result_calculate_formatted = (referencePoints) => {
    const head_top_y = referencePoints[ReferencePoint.Head_Top].y;
    const head_height_pixel = referencePoints[ReferencePoint.Head_Bottom].y - referencePoints[ReferencePoint.Head_Top].y;
    const pubicBone_y = referencePoints[ReferencePoint.PubicBone].y;
    const heel_y = referencePoints[ReferencePoint.Heel].y;
    const body_pixel = pubicBone_y - head_top_y;
    const leg_pixel = heel_y - pubicBone_y;
    const total_pixel = heel_y - head_top_y;
    return {
        body_pixel: (body_pixel / head_height_pixel).toFixed(1),
        leg_pixel: (leg_pixel / head_height_pixel).toFixed(1),
        total_pixel: (total_pixel / head_height_pixel).toFixed(1),
        body_percent: Math.round((body_pixel * 100) / total_pixel) + '%',
        leg_percent: Math.round((leg_pixel * 100) / total_pixel) + '%',
    };
};
/**
 * Update results on the text.
 * @param {Step} state Current step state.
 * @param {{ [key in ReferencePoint]: Point }} referencePoints Reference point state.
 */
const result_update = (state, referencePoints) => {
    document.getElementById('result_body').style.color = state === Step.End ? 'black' : 'lightgrey';
    document.getElementById('result_leg').style.color = state === Step.End ? 'black' : 'lightgrey';
    document.getElementById('result_total').style.color = state === Step.End ? 'black' : 'lightgrey';
    if (state === Step.End) {
        const formattedResults = result_calculate_formatted(referencePoints);
        document.getElementById('result_body').innerHTML =
            '<b>Body</b>: ' + formattedResults.body_pixel + ' heads (' + formattedResults.body_percent + ')';
        document.getElementById('result_leg').innerHTML =
            '<b>Leg</b>: ' + formattedResults.leg_pixel + ' heads (' + formattedResults.leg_percent + ')';
        document.getElementById('result_total').innerHTML =
            '<b>Total</b>: ' + formattedResults.total_pixel + ' heads';
    }
    else {
        document.getElementById('result_body').innerHTML = '<b>Body</b>: N/A';
        document.getElementById('result_leg').innerHTML = '<b>Leg</b>: N/A';
        document.getElementById('result_total').innerHTML = '<b>Total</b>: N/A';
    }
};
/**
 * Setup click.
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {{ [key in ReferencePoint]: Point }} referencePoints Reference point state.
 */
const click_setup = (canvas, referencePoints) => {
    document.addEventListener('mousedown', (e) => {
        const bounds = canvas.getBoundingClientRect();
        const x = e.pageX - bounds.left - scrollX;
        const y = e.pageY - bounds.top - scrollY;
        // Check that clicks are within canvas
        if (e.pageY >= bounds.top && e.pageY <= bounds.bottom && e.pageX >= bounds.left && e.pageX <= bounds.right) {
            if (currentStep === Step.Head_Top) {
                referencePoints[ReferencePoint.Head_Top] = { x: x, y: y };
                currentStep = Step.Head_Bottom;
            }
            else if (currentStep === Step.Head_Bottom) {
                referencePoints[ReferencePoint.Head_Bottom] = { x: x, y: y };
                currentStep = Step.Head_Left;
            }
            else if (currentStep === Step.Head_Left) {
                referencePoints[ReferencePoint.Head_Left] = { x: x, y: y };
                currentStep = Step.Head_Right;
            }
            else if (currentStep === Step.Head_Right) {
                referencePoints[ReferencePoint.Head_Right] = { x: x, y: y };
                currentStep = Step.PubicBone;
            }
            else if (currentStep === Step.PubicBone) {
                referencePoints[ReferencePoint.PubicBone] = { x: x, y: y };
                // Draw Pubic Bone line
                const pubicBone_y = referencePoints[ReferencePoint.PubicBone].y;
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                ctx.moveTo(0, pubicBone_y);
                ctx.lineTo(ctx.canvas.width, pubicBone_y);
                ctx.stroke();
                currentStep = Step.Heel;
            }
            else if (currentStep === Step.Heel) {
                referencePoints[ReferencePoint.Heel] = { x: x, y: y };
                // Draw Heel line
                const heel_y = referencePoints[ReferencePoint.Heel].y;
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                ctx.moveTo(0, heel_y);
                ctx.lineTo(ctx.canvas.width, heel_y);
                ctx.stroke();
                // Draw heads
                const head_left_x = referencePoints[ReferencePoint.Head_Left].x;
                const head_top_y = referencePoints[ReferencePoint.Head_Top].y;
                const head_width_pixel = referencePoints[ReferencePoint.Head_Right].x - referencePoints[ReferencePoint.Head_Left].x;
                const head_height_pixel = referencePoints[ReferencePoint.Head_Bottom].y - referencePoints[ReferencePoint.Head_Top].y;
                const total_pixel = heel_y - head_top_y;
                const head_imageData = ctx.getImageData(head_left_x, head_top_y, head_width_pixel, head_height_pixel);
                for (let i = 0; i < Math.ceil(total_pixel / head_height_pixel); i++) {
                    ctx.putImageData(head_imageData, ctx.canvas.width - head_width_pixel, head_top_y + head_height_pixel * i);
                }
                // Draw texts and results on canvas
                const formattedResults = result_calculate_formatted(referencePoints);
                const pubicBone_y = referencePoints[ReferencePoint.PubicBone].y;
                // Body
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'blue';
                ctx.moveTo(ctx.canvas.width - head_width_pixel - 10, head_top_y);
                ctx.lineTo(ctx.canvas.width - head_width_pixel - 10, pubicBone_y);
                ctx.stroke();
                ctx.font = '60px Arial';
                ctx.textAlign = 'end';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 7;
                ctx.strokeText(formattedResults.body_pixel, ctx.canvas.width - head_width_pixel - 15, (head_top_y + pubicBone_y) / 2);
                ctx.fillStyle = 'blue';
                ctx.fillText(formattedResults.body_pixel, ctx.canvas.width - head_width_pixel - 15, (head_top_y + pubicBone_y) / 2);
                ctx.font = '26px Arial';
                ctx.textAlign = 'end';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 4;
                ctx.strokeText(formattedResults.body_percent, ctx.canvas.width - head_width_pixel - 15, (head_top_y + pubicBone_y) / 2 + 30);
                ctx.fillStyle = 'blue';
                ctx.fillText(formattedResults.body_percent, ctx.canvas.width - head_width_pixel - 15, (head_top_y + pubicBone_y) / 2 + 30);
                // Leg
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'green';
                ctx.moveTo(ctx.canvas.width - head_width_pixel - 15, pubicBone_y);
                ctx.lineTo(ctx.canvas.width - head_width_pixel - 15, heel_y);
                ctx.stroke();
                ctx.font = '60px Arial';
                ctx.textAlign = 'end';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 7;
                ctx.strokeText(formattedResults.leg_pixel, ctx.canvas.width - head_width_pixel - 20, (pubicBone_y + heel_y) / 2);
                ctx.fillStyle = 'green';
                ctx.fillText(formattedResults.leg_pixel, ctx.canvas.width - head_width_pixel - 20, (pubicBone_y + heel_y) / 2);
                ctx.font = '26px Arial';
                ctx.textAlign = 'end';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 4;
                ctx.strokeText(formattedResults.leg_percent, ctx.canvas.width - head_width_pixel - 20, (pubicBone_y + heel_y) / 2 + 30);
                ctx.fillStyle = 'green';
                ctx.fillText(formattedResults.leg_percent, ctx.canvas.width - head_width_pixel - 20, (pubicBone_y + heel_y) / 2 + 30);
                // Total
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'orange';
                ctx.moveTo(15, head_top_y);
                ctx.lineTo(15, heel_y);
                ctx.stroke();
                ctx.font = '60px Arial';
                ctx.textAlign = 'start';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 7;
                ctx.strokeText(formattedResults.total_pixel, 20, (head_top_y + heel_y) / 3);
                ctx.fillStyle = 'orange';
                ctx.fillText(formattedResults.total_pixel, 20, (head_top_y + heel_y) / 3);
                currentStep = Step.End;
            }
            text_update(currentStep, referencePoints);
        }
    });
};
const button = document.getElementById('start');
button.addEventListener('click', (e) => {
    console.log(e);
    currentStep = Step.Head_Top;
    text_update(currentStep, referencePoints);
    ctx.drawImage(cachedImage, 0, 0);
});
// State
const canvas = document.getElementById('canvas_main');
const ctx = canvas.getContext('2d');
const referencePoints = {
    [ReferencePoint.Head_Top]: { x: 0, y: 0 },
    [ReferencePoint.Head_Bottom]: { x: 0, y: 0 },
    [ReferencePoint.Head_Left]: { x: 0, y: 0 },
    [ReferencePoint.Head_Right]: { x: 0, y: 0 },
    [ReferencePoint.PubicBone]: { x: 0, y: 0 },
    [ReferencePoint.Heel]: { x: 0, y: 0 },
};
let currentStep = Step.Paste;
let cachedImage;
paste_setup(window, canvas, true);
click_setup(canvas, referencePoints);
text_update(currentStep, referencePoints);
//# sourceMappingURL=body-proportion-analyzer.js.map