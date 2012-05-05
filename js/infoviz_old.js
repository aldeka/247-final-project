    function makeTree(ulID, theCase) {
        // recursive function for turning the cases into a tree of nested uls and lis
        var theUL = $('#' + ulID);
        theUL.append('<li>' + theCase.name + '</li>');
        if (theCase.citedBy.length > 0) {
            var theNewULID = cleanID(theCase.name).slice(0,9) +'-children';
            theUL.append('<ul id="' + theNewULID + '"></ul>');
            orderCitations(theCase.citedBy).forEach(function(item) {
                //console.log(item.name)
                makeTree(theNewULID,item);
            });
            var remainingCites = theCase.totalCites - theCase.citedBy.length;
            $('#' + theNewULID).append('<li>' + remainingCites + ' more citations...');
        }
    }
    
    function cleanID(rawString) {
        s = rawString.replace(/ /g,'');
        return s.replace(".","-");
    }
    
    function sortFunc(x, y) {
        return x.year - y.year;
    }

    function yearScale(child, root) {
        var yearsAfter = child.year - root.year;
        var totalYears = new Date().getFullYear() - root.year;
        return yearsAfter/totalYears
    }

    function drawRootBox(paper, root, boxHeight) {
        // make top box
        paper.rect(0,0,paper.width,paper.height).attr("fill","white").attr("stroke","white");
        paper.rect(0,0,paper.width,boxHeight).attr("fill",'#ddffcc').attr("stroke", '#99bb88');
        // todo: make title text wrap sanely
        paper.text(paper.width/2, boxHeight/4, root.label()).attr("font-size",14);  
    }

    function getNodeX(offset, paper_width, radius) {
        var nodeX = offset + radius;
        if (nodeX % paper_width < radius) {
            nodeX += radius * 2;
        }
        if (nodeX % paper_width + radius > paper_width) {
            nodeX += radius * 2;
        } 
        return nodeX % paper_width;
    }
    
    function drawTree(paper, root) {
        var xcoord = 10;
        var topboxThickness = 40;
        drawRootBox(paper, root, topboxThickness);

        // make the child nodes
        for(var i in root.citedBy.sort(sortFunc)) {
            var c = root.citedBy.sort(sortFunc)[i];
            // set size and horiz position of node
            var influence = Math.max(c.totalCites / 50, 5);
            var nodeX = getNodeX(xcoord, paper.width, influence);
            // set vertical position of node based on year
            var nodeY = 5 + topboxThickness + influence + (paper.height - 10 - topboxThickness) * yearScale(c, root);
            // Draw line to node
            var path = paper.path("M" + nodeX + ","+topboxThickness+"V" + nodeY);
            path.attr("stroke", '#99bb88');
            // create node
            // todo: make nodes that are negative (in root.undercutBy) look like bombs (or otherwise look different)
            var node = paper.circle(nodeX, nodeY, influence);
            node.attr("fill",courtColors[c.court]).attr("stroke",courtColors[c.court]);
            // let node know about its own case, other metadata
            node.influence = influence;
            node.x = nodeX;
            node.y = nodeY;
            node.c = c;
            
            // add animation characteristics
            // show title and glow on hover
            node.hover(function() {
                // todo: make glow and labels fade in and out slightly
                this.g = this.glow({color: "#bbb", width: 8});
                // todo: make labels wrap sanely
                this.caseLabel = paper.text(this.x, this.y + this.influence + 5,this.c.label()).attr("fill","#555");
            }, 
                function() {
                this.g.hide();
                this.caseLabel.remove();
                }); 
            // make nodes with descendants clickable
            if (c.citedBy.length > 0) {
                node.click(function() {
                    event.preventDefault();
                    root = this.c;
                    // todo: make this a nice animation instead of (just) clearing
                    paper.clear();
                    drawTree(paper,root);
                });
            }
            // turn nodes that have descendents into links (so cursor changes)
            if (c.citedBy.length > 0) {
                node.attr("href","#");
            }
            xcoord = nodeX + influence + 5;
        }
    };


    
    $(document).ready(function() {
        // our first case is Plessy
        var root = plessy;
        // set up Raffi
        var height = $(window).height();
        var width = $(window).width()*0.5;
        var paper = Raphael(10, 10,width,height);
        // draw the tree
        drawTree(paper, root);
        // todo: add legend for court colors, time axis
    });
