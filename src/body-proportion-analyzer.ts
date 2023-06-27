
type Point = {
    x: number;
    y: number;
};

enum ReferencePoint {
    Head_Top,
    Head_Bottom,
    Head_Left,
    Head_Right,
    PubicBone,
    Heel,
}

enum Step {
    Paste,
    Start,
    Head_Top,
    Head_Bottom,
    Head_Left,
    Head_Right,
    PubicBone,
    Heel,
    End,
}

const paste_createImage = (canvas: HTMLCanvasElement, source: string, resize: boolean): void => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    const pastedImage = new Image();
    pastedImage.src = source;
    pastedImage.onload = function () {
        if (resize) {
            canvas.width = pastedImage.width;
            canvas.height = pastedImage.height;
            canvas.style.width = pastedImage.width + 'px';
            canvas.style.height = pastedImage.height + 'px';
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(pastedImage, 0, 0);
    };
    cachedImage = pastedImage;
};

const paste_process = (
    e: ClipboardEvent,
    window: Window & typeof globalThis,
    canvas: HTMLCanvasElement,
    resize: boolean,
): void => {
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

const paste_setup = (window: Window & typeof globalThis, canvas: HTMLCanvasElement, resize: boolean): void => {
    document.addEventListener(
        'paste',
        function (e) {
            paste_process(e, window, canvas, resize);
            currentStep = Step.Start;
            text_update(currentStep, referencePoints);
        },
        false,
    );
};


const text_update = (state: Step, referencePoints: { [key in ReferencePoint] : Point }): void => {
    (document.getElementById('step_paste') as HTMLElement).style.color = state === Step.Paste ? 'black' : 'lightgrey';
    (document.getElementById('step_start') as HTMLElement).style.color = state === Step.Start ? 'black' : 'lightgrey';
    (document.getElementById('step_head_top') as HTMLElement).style.color = state === Step.Head_Top ? 'black' : 'lightgrey';
    (document.getElementById('step_head_bottom') as HTMLElement).style.color = state === Step.Head_Bottom ? 'black' : 'lightgrey';
    (document.getElementById('step_head_left') as HTMLElement).style.color = state === Step.Head_Left ? 'black' : 'lightgrey';
    (document.getElementById('step_head_right') as HTMLElement).style.color = state === Step.Head_Right ? 'black' : 'lightgrey';
    (document.getElementById('step_pubicBone') as HTMLElement).style.color = state === Step.PubicBone ? 'black' : 'lightgrey';
    (document.getElementById('step_heel') as HTMLElement).style.color = state === Step.Heel ? 'black' : 'lightgrey';
    (document.getElementById('step_end') as HTMLElement).style.color = state >= Step.End ? 'black' : 'lightgrey';

    result_calculate(state, referencePoints);
}



const result_calculate_formatted = (referencePoints: { [key in ReferencePoint] : Point }): {body_pixel: string, leg_pixel: string, total_pixel: string, body_percent: string, leg_percent: string} => {
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
        body_percent: Math.round(body_pixel * 100 / total_pixel) + '%',
        leg_percent: Math.round(leg_pixel * 100 / total_pixel) + '%',
    }
}




const result_calculate = (state: Step, referencePoints: { [key in ReferencePoint] : Point }): void => {
    (document.getElementById('result_body') as HTMLElement).style.color = state === Step.End ? 'black' : 'lightgrey';
    (document.getElementById('result_leg') as HTMLElement).style.color = state === Step.End ? 'black' : 'lightgrey';
    (document.getElementById('result_total') as HTMLElement).style.color = state === Step.End ? 'black' : 'lightgrey';

    if (state === Step.End)
    {
        var formattedResults = result_calculate_formatted(referencePoints);
        (document.getElementById('result_body') as HTMLElement).innerHTML = '<b>Body</b>: ' + formattedResults.body_pixel + ' heads (' + formattedResults.body_percent + ')';
        (document.getElementById('result_leg') as HTMLElement).innerHTML = '<b>Leg</b>: ' + formattedResults.leg_pixel + ' heads (' + formattedResults.leg_percent + ')';
        (document.getElementById('result_total') as HTMLElement).innerHTML = '<b>Total</b>: ' + formattedResults.total_pixel + ' heads';
    }
    else
    {
        (document.getElementById('result_body') as HTMLElement).innerHTML = '<b>Body</b>: N/A';
        (document.getElementById('result_leg') as HTMLElement).innerHTML = '<b>Leg</b>: N/A';
        (document.getElementById('result_total') as HTMLElement).innerHTML = '<b>Total</b>: N/A';
    }
}

const click_setup = (canvas: HTMLCanvasElement, referencePoints: { [key in ReferencePoint] : Point }): void => {
    document.addEventListener('mousedown', (e: MouseEvent) => {
        const bounds = canvas.getBoundingClientRect();
        const x = e.pageX - bounds.left - scrollX;
        const y = e.pageY - bounds.top - scrollY;

        if (e.pageY >= bounds.top && e.pageY <= bounds.bottom && e.pageX >= bounds.left && e.pageX <= bounds.right) {
            if (currentStep === Step.Head_Top)
            {
                referencePoints[ReferencePoint.Head_Top] = {x: x, y: y};
                
                currentStep = Step.Head_Bottom;
            }
            else if (currentStep === Step.Head_Bottom)
            {
                referencePoints[ReferencePoint.Head_Bottom] = {x: x, y: y};
                
                currentStep = Step.Head_Left;
            }
            else if (currentStep === Step.Head_Left)
            {
                referencePoints[ReferencePoint.Head_Left] = {x: x, y: y};
                
                currentStep = Step.Head_Right;
            }
            else if (currentStep === Step.Head_Right)
            {
                referencePoints[ReferencePoint.Head_Right] = {x: x, y: y};

                currentStep = Step.PubicBone;
            }
            else if (currentStep === Step.PubicBone)
            {
                referencePoints[ReferencePoint.PubicBone] = {x: x, y: y};
                
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
            else if (currentStep === Step.Heel)
            {
                referencePoints[ReferencePoint.Heel] = {x: x, y: y};

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
                for (let i = 0; i < Math.ceil(total_pixel / head_height_pixel); i++)
                {
                    ctx.putImageData(head_imageData, ctx.canvas.width - head_width_pixel, head_top_y + head_height_pixel * i);
                }

                // Add text on canvas

                var formattedResults = result_calculate_formatted(referencePoints);

                const pubicBone_y = referencePoints[ReferencePoint.PubicBone].y;

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











const button: HTMLButtonElement = document.getElementById('start') as HTMLButtonElement;
button.addEventListener('click', (e: Event) => {
    console.log(e);
    currentStep = Step.Head_Top;
    text_update(currentStep, referencePoints);
    ctx.drawImage(cachedImage, 0, 0);
});




// State
const canvas: HTMLCanvasElement = document.getElementById('canvas_main') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
const referencePoints: { [key in ReferencePoint] : Point } = {
    [ReferencePoint.Head_Top]: {x: 0, y: 0},
    [ReferencePoint.Head_Bottom]: {x: 0, y: 0},
    [ReferencePoint.Head_Left]: {x: 0, y: 0},
    [ReferencePoint.Head_Right]: {x: 0, y: 0},
    [ReferencePoint.PubicBone]: {x: 0, y: 0},
    [ReferencePoint.Heel]: {x: 0, y: 0},
}
let currentStep: Step = Step.Paste;
let cachedImage: HTMLImageElement;




paste_setup(window, canvas, true);
click_setup(canvas, referencePoints);
text_update(currentStep, referencePoints);



