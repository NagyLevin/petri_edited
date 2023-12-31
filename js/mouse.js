function mousedown(evt) {
    const cursor=getCoord(evt);
    pn.mouseDownCoord=cursor;
    o = pn.getCursoredObject(cursor);
    if (evt.button==0) { // Left button
        if (o==null) {
            // New Object, Pan
            if (state==IDLE && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
                stateChange(LEFTDOWN);
            }
        }
        else if (o) {
            // Object click, Drag
            if (!evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
                stateChange(LEFTDOWN);
                pn.dragged=o;
            }
            // Subnet drag
            else if (evt.shiftKey) {
                stateChange(DRAGALL);
                pn.draggedAll.length=0;
                pn.getDraggedAll(o);
            }
            // New potential Flow
            else if (evt.ctrlKey) {
                stateChange(DRAWARROW);
            }
            // Multisegment Flow
            else if (evt.altKey && o.type==FLOW) {
                stateChange(MULTISEGMENT);
                pn.dragged=o;
            }
        }
    }
    else if (evt.button==2) { // Right button
        if (o==null) {
            // Running mode
            if (state==IDLE) stateChange(RUN);
            else if (state==RUN) stateChange(IDLE);
        }
        // Delete
        else {
            stateChange(DELETE);
        }
    }
    // Zoom
    else if (evt.button==1) { // Middle button
        stateChange(MIDDLE);
    }
}

function mouseup(evt) {
    const cursor=getCoord(evt);
    o = pn.getCursoredObject(cursor);
    // New Flow
    if (state==DRAWARROW && o && o!=pn.highlighted) {
        pn.addFlows(pn.highlighted,o);
        pn.highlighted=o;
    }
    else if (state==LEFTDOWN && o && o==pn.highlighted && closeEnough(pn.mouseDownCoord,cursor)) {
        // Toggle
        if (pn.noFlowFromHere(o)) {
            // Toggle Place to Transition
            if (o.type==PLACE) {
                o.delete();
                const newTrans=new Transition(o.x,o.y);
                pn.addTransition(newTrans);
                pn.highlighted=newTrans;
                delete o;
            }
            // Toggle Transition to Place
            else if (o.type==TRANSITION) {
                o.delete();
                const newPlace=new Place(o.x,o.y);
                pn.addPlace(newPlace);
                pn.highlighted=newPlace;
                delete o;
            }
            // Toggle Flow Enabler/Inhiboitor
            else if(o.type==FLOW && o.o1.type==PLACE) {
                if (o.subtype=="ENABLER") o.subtype="INHIBITOR";
                else if (o.subtype=="INHIBITOR") o.subtype="ENABLER";
            }
        }
        // Fire a Transition
        else if(o.type==TRANSITION) {
            if (o.enabled()) pn.fireOne(o);
        }
    }
    // New Place
    else if (state==LEFTDOWN && closeEnough(pn.mouseDownCoord,cursor)) {
        const newPlace = new Place(cursor.x,cursor.y);
        pn.addPlace(newPlace);
        pn.highlighted=newPlace;
    }
    // Delete Object
    else if (state==DELETE && closeEnough(pn.mouseDownCoord,cursor) && o) {
        o.delete();
        delete o;
        pn.highlighted=null;
    }
    // Clear Place Tokens
    else if (state==MIDDLE && o && o.type==PLACE) {
        o.changeTokens(-o.tokens);
    }
    // Clear all net Tokens
    else if (state==MIDDLE && !o) {
        pn.p.forEach(p => p.changeTokens(-p.tokens));
    }
    if (state!=RUN) stateChange(IDLE);
    pn.dragged=null;
    pn.paleArrow=null;
}

function mousemove(evt) {
    const cursor=getCoord(evt);
    // Init Drag
    if (state==LEFTDOWN && !closeEnough(pn.mouseDownCoord,cursor)) {
        stateChange(DRAG);
    }
    // Do Drag
    if (state==DRAG && pn.dragged) {
        pn.dragged.dragTo(cursor.x-pn.mouseDownCoord.x,cursor.y-pn.mouseDownCoord.y);
        pn.mouseDownCoord.x=cursor.x;
        pn.mouseDownCoord.y=cursor.y;
    }
    // Do DragAll (SubNet)
    else if (state==DRAGALL) {
        pn.draggedAll.forEach(da => { 
            da.dragTo(cursor.x-pn.mouseDownCoord.x,cursor.y-pn.mouseDownCoord.y); 
        });
        pn.mouseDownCoord.x=cursor.x;
        pn.mouseDownCoord.y=cursor.y;
    }
    // Draw potetntial new Flow
    else if (state==DRAWARROW) {
        pn.paleArrow=[pn.highlighted, cursor];
    }
    // Do Pan
    else if (state==DRAG || state==PAN) {
        if (!closeEnough(pn.mouseDownCoord,cursor))
        {
            stateChange(PAN);
            pn.vpx+=cursor.x-pn.mouseDownCoord.x;
            pn.vpy+=cursor.y-pn.mouseDownCoord.y;
        }
    }
    // Multisegment Flow
    else if (state==MULTISEGMENT) {
        // Init multisegment
        if (state==MULTISEGMENT) {
            pn.highlighted=pn.dragged.addSegment(pn.mouseDownCoord);
            pn.dragged=pn.highlighted;
            stateChange(DRAG);
        }
    }
    // Highlight mouseovered object
    else {
        o = pn.getCursoredObject(cursor);
        if (o) {
            pn.highlighted = o;
        }
        else pn.highlighted = null;
    }
}

function mousewheel(evt) {
    const delta=-Math.sign(evt.deltaY);
    const cursor=getCoord(evt);
    o = pn.getCursoredObject(cursor);
    // Zoom
    if (state==MIDDLE || state==ZOOM) {
        stateChange(ZOOM);
        pn.zoom+=delta/10;
        pn.zoom=Math.round(10*pn.zoom)/10;
        if (pn.zoom<0.3) pn.zoom=0.3;
        if (pn.zoom>3) pn.zoom=3;
    }
    else if (o && evt.button!=1 && !evt.ctrlKey) {
        // Tokens add/remove
        if (o.type==PLACE) {
            o.changeTokens(delta);
        }
        // Rotate Transition
        else if (o.type==TRANSITION) {
            o.alpha+=delta*Math.PI/32;
            if (o.alpha>2*Math.PI) o.alpha-=2*Math.PI;
            if (o.alpha<0) o.alpha+=2*Math.PI;
            if (Math.abs(o.alpha-1*Math.PI/4)<Math.PI/50) o.alpha=1*Math.PI/4;
            if (Math.abs(o.alpha-2*Math.PI/4)<Math.PI/50) o.alpha=2*Math.PI/4;
            if (Math.abs(o.alpha-3*Math.PI/4)<Math.PI/50) o.alpha=3*Math.PI/4;
            if (Math.abs(o.alpha)<Math.PI/50) o.alpha=0;
            o.adjust_p1p2();
            if (!o.cursored(cursor)) pn.highlighted=null;
        }
        // Adjust Flow weight
        else if (o.type==FLOW) {
            o.weight+=delta;
            if (o.weight<1) o.weight=1;
        }
    }
    // Rewind and Forward
    else {
        stateChange(IDLE);
        if (delta<0) {
            if (pn.mptr>0) {
                pn.restoreMarking(pn.markings[--pn.mptr]);
            }
        }
        if (delta>0) {
            if (pn.mptr<pn.markings.length-1) {
                pn.restoreMarking(pn.markings[++pn.mptr]);
            }
            // One random fire
            else {
                pn.fireOne();
            }
        }
    }
}
