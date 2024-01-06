const bh=20,br=10,bdw=17,bdh=12,bdo=3;

class Button extends Object {
    constructor(button,x,y,width=50) {
        super(x,y);
        this.type=BUTTON;
        this.button=button;
        this.width=width;
        pn.addButton(this);
        if (button=="PLAY") this.label=new Label("PLAY",x,y+bh);
        else if (button=="STOP") this.label=new Label("STOP",x,y+bh);
        else if (button=="RUN") this.label=new Label("RUN",x,y+bh);
        else if (button=="STEP_BWD") this.label=new Label("STEP-",x,y+bh);
        else if (button=="STEP_FWD") this.label=new Label("STEP+",x,y+bh);
        else if (button=="REWIND") this.label=new Label("m0",x,y+bh);
        else if (button=="HELP") this.label=new Label("HELP",x,y+bh);
        else if (button=="UNDO_ALL") this.label=new Label("ORIG",x,y+bh);
        else if (button=="UNDO") this.label=new Label("UNDO",x,y+bh);
        else if (button=="REDO") this.label=new Label("REDO",x,y+bh);
        else if (button=="CLEAR") this.label=new Label("NEW",x,y+bh);
        else if (button=="OPEN") this.label=new Label("OPEN",x,y+bh);
        else if (button=="SAVE") this.label=new Label("SAVE",x,y+bh);
        else if (button=="FLY") this.label=new Label("FLY",x,y+bh);
        pn.l.pop();
    }

    draw() {
        ctx.beginPath();
        solid();
        ctx.strokeStyle="black";
        ctx.fillStyle="black";
        ovalPatch(this.x,this.y,this.width,bh,br);
        ctx.stroke();
        if (this.button=="PLAY") {
            triangle(false.length==0,this.x,this.y,bdw,bdh,bdo);
        }
        else if (this.button=="STOP") {
            ctx.beginPath();
            ctx.fillStyle=(state==RUN||state==SLOWRUN)?COLOR_INK:"gray";
            ctx.rect(this.x-bdh/2,this.y-bdh/2,bdh,bdh);
            ctx.fill();
        }
        else if (this.button=="STEP_FWD") {
            if (pn.mptr==pn.markings.length-1&&pn.getEnabled().length>0) {
                this.label.label="FIRE";
            }
            else {
                this.label.label="STEP+";
            }
            triangle(pn.mptr==pn.markings.length-1&&pn.getEnabled().length==0,this.x,this.y,2*bdw/3,bdh,-1);
            ctx.beginPath();
            ctx.rect(this.x+bdw/3-1,this.y-bdh/2,4,bdh);
            ctx.fill();
        }
        else if (this.button=="RUN") {
            triangle(false,this.x,this.y,2*bdw/3,bdh,-1);
            triangle(false,this.x+2*bdw/3-2,this.y,2*bdw/3,bdh,-1);
        }
        else if (this.button=="FLY") {
            triangle(false,this.x,this.y,2*bdw/3,bdh,-6);
            triangle(false,this.x+2*bdw/3-3,this.y,2*bdw/3,bdh,-6);
            triangle(false,this.x+4*bdw/3-6,this.y,2*bdw/3,bdh,-7);
        }
        else if (this.button=="STEP_BWD") {
            triangle(pn.mptr<1,this.x,this.y,2*bdw/3,bdh,+1,-1);
            ctx.beginPath();
            ctx.rect(this.x-bdw/3-3,this.y-bdh/2,4,bdh);
            ctx.fill();
        }
        else if (this.button=="REWIND") {
            triangle(pn.mptr<1,this.x,this.y,2*bdw/3,bdh,-3,-1);
            triangle(pn.mptr<1,this.x+2*bdw/3-2,this.y,2*bdw/3,bdh,-3,-1);
            ctx.beginPath();
            ctx.rect(this.x-bdw/3-5,this.y-bdh/2,4,bdh);
            ctx.fill();
        }
        else if (this.button=="HELP") {
            ctx.beginPath();
            ctx.font="bold 18px arial";
            ctx.fillText("?",this.x,this.y+1);
            ctx.fillText("?",this.x-1,this.y+1);
            ctx.fillText("?",this.x+1,this.y+1);
        }
        else if (this.button=="UNDO") {
            curvedArrow(undoPtr<1,this.x,this.y);
        }
        else if (this.button=="REDO") {
            curvedArrow(undoPtr==undo.length-1,this.x,this.y,-1);
        }
        else if (this.button=="UNDO_ALL") {
            triangle(undo.length<=1,this.x,this.y,2*bdw/3,bdh,-6,-1);
            triangle(undo.length<=1,this.x+2*bdw/3-2,this.y,2*bdw/3,bdh,-6,-1);
        }
        else if (this.button=="CLEAR") {
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.rect(this.x-bdh/2,this.y-bdh/2,bdh,bdh);
            ctx.stroke();
        }
        else if (this.button=="OPEN") {
            ctx.beginPath();
            ctx.moveTo(this.x-8,this.y+7);
            ctx.lineTo(this.x+8,this.y+7);
            ctx.lineTo(this.x+13,this.y-3);
            ctx.lineTo(this.x-3,this.y-3);
            ctx.lineTo(this.x-8,this.y+7);
            ctx.fill();
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.moveTo(this.x+8,this.y-3);
            ctx.lineTo(this.x+8,this.y-5);
            ctx.lineTo(this.x+2,this.y-5);
            ctx.lineTo(this.x-1,this.y-7);
            ctx.lineTo(this.x-7,this.y-7);
            ctx.lineTo(this.x-8,this.y-6);
            ctx.lineTo(this.x-8,this.y+6);
            ctx.lineTo(this.x-7,this.y+6);
            ctx.stroke();
        }
        else if (this.button=="SAVE") {
            ctx.beginPath();
            ctx.lineWidth=1;
            ctx.moveTo(this.x-8,this.y+8);
            ctx.lineTo(this.x+8,this.y+8);
            ctx.lineTo(this.x+8,this.y-4);
            ctx.lineTo(this.x+4,this.y-8);
            ctx.lineTo(this.x-8,this.y-8);
            ctx.lineTo(this.x-8,this.y+8);
            ctx.fill();
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="white";
            ctx.moveTo(this.x+2,this.y-7);
            ctx.lineTo(this.x+2,this.y-3);
            ctx.lineTo(this.x-4,this.y-3);
            ctx.lineTo(this.x-4,this.y-7);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.x-5,this.y+6);
            ctx.lineTo(this.x+5,this.y+6);
            ctx.moveTo(this.x-5,this.y+3);
            ctx.lineTo(this.x+5,this.y+3);
            ctx.stroke();
        }
        if (this.label) this.label.draw(12);
    }

    dragTo() {}

    cursored(cursor) {
        return (
            Math.abs(this.x-cursor.x)<=this.width/2 && 
            Math.abs(this.y-cursor.y)<=bh/2
        );
    }

    clicked(evt) {
        if (this.button=="PLAY") {
            if (state!=SLOWRUN) stateChange(SLOWRUN);
            else stateChange(IDLE);
        }
        else if (this.button=="RUN") {
            if (state!=RUN) stateChange(RUN);
            else stateChange(IDLE);
        }
        else if (this.button=="FLY") {
            if (state!=FLY) stateChange(FLY);
            else stateChange(IDLE);
        }
        else if (this.button=="STOP") {
            stateChange(IDLE);
        }
        else if (this.button=="STEP_BWD") {
            stateChange(IDLE);
            pn.stepBackward();
        }
        else if (this.button=="STEP_FWD") {
            stateChange(IDLE);
            pn.stepForward();
        }
        else if (this.button=="REWIND") {
            stateChange(IDLE);
            pn.rewind();
        }
        else if (this.button=="HELP") {
            window.open("help.html", "_blank");
        }
        else if (this.button=="UNDO") {
            if (undoPtr>0) rawLoad(undo[--undoPtr]);
        }
        else if (this.button=="REDO") {
            if (undoPtr<undo.length-1) rawLoad(undo[++undoPtr]);
        }
        else if (this.button=="UNDO_ALL") {
            if (undo.length>0) { undoPtr=0; rawLoad(undo[undoPtr]) };
        }
        else if (this.button=="CLEAR") {
            if (confirm("Sure want to clear workspace?")) {
                pn.clear();
                undo.length=0;
                undoPtr=-1;
            }
        }
        else if (this.button=="OPEN") {
            pn.animate=false;
            directory="nets";
            if (shiftKeys(evt,"CTRLSHIFT")) directory="upload";
            pn.getFileNames(directory);
        }
        else if (this.button=="SAVE") {
            pn.save(""+ms+".pn");
            alert("PetriNet uploaded for review.");
        }
    }
}

function selectFile() {
    clearCanvas(canvas);
    ctx.beginPath();
    ctx.fillStyle=COLOR_INK;
    ctx.textAlign = "left";
    ctx.textBaseline = 'top';
    ctx.font="16px arial";
    for (var i=0; i<files.length; i++) {
        ctx.fillText(files[i],50,50+i*20);
    }
    stateChange(FILES);
}

function ovalPatch(x,y,w,h,r) {
    ctx.lineWidth=1;
    ctx.moveTo(x-w/2+r,y-h/2);
    ctx.lineTo(x+w/2-r,y-h/2);
    ctx.moveTo(x+w/2-r,y-h/2);
    ctx.arc(x+w/2-r,y,r,3*Math.PI/2,Math.PI/2);
    ctx.moveTo(x+w/2-r,y+h/2);
    ctx.lineTo(x-w/2+r,y+h/2);
    ctx.arc(x-w/2+r,y,r,Math.PI/2,3*Math.PI/2);
}

function triangle(grayed,x,y,w,h,o,r=1) { // r for reverse
    ctx.beginPath();
    ctx.fillStyle=grayed?"gray":COLOR_INK;
    ctx.lineWidth=1;
    ctx.moveTo(x-r*w/2+o,y-h/2);
    ctx.lineTo(x+r*w/2+o,y);
    ctx.lineTo(x-r*w/2+o,y+h/2);
    ctx.lineTo(x-r*w/2+o,y-h/2);
    ctx.fill();
}

function curvedArrow(grayed,x,y,r=1) { // r for reverse
    ctx.beginPath();
    ctx.strokeStyle=grayed?"gray":COLOR_INK;
    ctx.fillStyle=grayed?"gray":COLOR_INK;
    ctx.lineWidth=3;
    var ux=-4,uy=-3,a1=3,a2=7;
    ctx.moveTo(x+r*(ux-a1),y+(uy-a1));
    ctx.lineTo(x+r*(ux+a1),y+(uy+a1));
    ctx.lineTo(x+r*(ux-a2),y+(uy+a2));
    ctx.lineTo(x+r*(ux-a1),y+(uy-a1));
    ctx.fill();
    ctx.beginPath();
    if (r==1) ctx.arc(x,y+1,bdh/2,5*Math.PI/4,Math.PI/4);
    else if (r==-1) ctx.arc(x,y+1,bdh/2,3*Math.PI/4,7*Math.PI/4);
    ctx.stroke();
}

var x,y=20,w,dw,dx;
function setupButton() {
    x=50,w=35,dx=0,dw=40;
    new Button("CLEAR",x+dx++*dw,y,w);
    new Button("OPEN",x+dx++*dw,y,w);
    new Button("SAVE",x+dx++*dw,y,w);
    new Button("UNDO_ALL",x+dx++*dw,y,w);
    new Button("UNDO",x+dx++*dw,y,w);
    new Button("REDO",x+dx++*dw,y,w);

    x=330,w=50,dx=0,dw=55;
    new Button("REWIND",x+dx++*dw,y,w);
    new Button("STEP_BWD",x+dx++*dw,y,w);
    new Button("STEP_FWD",x+dx++*dw,y,w);
    new Button("PLAY",x+dx++*dw,y,w);
    new Button("STOP",x+dx++*dw,y,w);
    new Button("RUN",x+dx++*dw,y,w);
    new Button("FLY",x+dx++*dw,y,w);

    new Button("HELP",740,y,35);
}
