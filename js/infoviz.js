var padding = 10;
var radius_scale = 1/40;
var min_radius = 5;
var root_width = 350;
var parent_width = 20;
    
    
function getExtract(paper,root,title, offset) {
    //&prop=info&inprop=url
    console.log(title);
    $.getJSON('http://en.wikipedia.org/w/api.php?format=json&callback=?&action=query&titles=' + title + '&prop=extracts|info&inprop=url&exlimit=1&exintro&explaintext&redirects', function(data){
        console.log(data);
        var stuff = [];
        for (var page in data.query.pages) {
            var extract = data.query.pages[page].extract;
            var url = data.query.pages[page].fullurl;
        }
        
        // Add wikipedia-based info about case
        var x = offset *1.5
        var y = paper.height * .5 + 60;
        var attrs = {'font-size': 12, 'text-anchor': 'start'};
        var t = wrapText(paper, x, y, paper.width - x, 'Synopsis:\n \n \n ' + extract + '\n \n \n From ' + url, attrs);
	// Text y attr is center, so shift text down by the difference between center and top
	var box = t.getBBox();
	var y_shift = y - box.y;
	t.transform("t0," + y_shift);
    });
}

function cleanID(rawString) {
    s = rawString.replace(/ /g,'');
    return s.replace(".","-");
}

function yearSort(x, y) {
    return x.year - y.year;
}

function influenceSort(x, y) {
    return y.totalCites - x.totalCites;
}

function yearScale(child, root) {
    var yearsAfter = child.year - root.year;
    var totalYears = new Date().getFullYear() - root.year;
    return yearsAfter/totalYears;
}

// http://stackoverflow.com/questions/3142007/how-to-either-determine-svg-text-box-width-or-force-line-breaks-after-x-chara
function wrapText(paper, x, y, maxWidth, text, attrs) {
    var t = paper.text(x, y).attr(attrs);
    var words = text.split(" ");

    var tempText = "";
    for (var i=0; i<words.length; i++) {
	t.attr("text", tempText + " " + words[i]);
	if (t.getBBox().width > maxWidth) {
	    tempText += "\n" + words[i];
	} else {
	    tempText += " " + words[i];
	}
    }
    // Substring to ignore initial space
    t.attr("text", tempText.substring(1));
    return t;
}

function drawParent(paper, node, height) {
    if (node.parent == null) {
	return 0;
    }
    var num_parents = drawParent(paper, node.parent, height);
    var x = num_parents * parent_width;
    var attrs = {"fill" : courtColors[node.parent.court], "stroke" : "#aaa", 'cursor': 'pointer', 'title': node.parent.name};
    var rect = paper.rect(x, 0, parent_width, height).attr(attrs);
    rect.c = node.parent;
    rect.hover(function() {
	    this.attr('fill-opacity', 0.7);
    },
	       function() {
		   this.attr('fill-opacity', 1);
	       });
    rect.click(function() {
	    paper.clear();
	    drawTree(paper, this.c);
        });
    return num_parents + 1;
}

function drawRootCir(paper, root) {
    var radius = paper.height * .25;
    var rootCircleBG = paper.circle(0, radius, radius).attr({"fill" : '#fff', "stroke" : "#aaa"});
    var rootCircle = paper.circle(0, radius, radius).attr({"opacity" : .4,  "fill" : courtColors[root.court], "stroke" : '#999'});
    var num_parents = drawParent(paper, root, radius * 2);    
    var parent_offset = num_parents*parent_width;
    var label_x = parent_offset + radius/2;
    var attrs = {"font-size": 16, "font-weight": "bold"};  
    wrapText(paper, label_x, radius - padding, radius - (parent_offset + 2*padding), root.label(), attrs);
    rootCircleBG.transform('t' + parent_offset + ',0');
    rootCircle.transform('t' + parent_offset + ',0');
    return rootCircle; 
}

function getTickIncrement(min_year, max_year) {
    var increments = [1, 5, 10, 25];
    var increment;
    for (var i in increments) {
	increment = increments[i];
	var num_increments = Math.floor((max_year - min_year) / increment);
	if (num_increments < 12) {
	    return increment;
	}
	if (num_increments < 5 && increment == 1) {
	    return increment;
	}
    }
    return increment;
}

function drawTimeline(paper, max_length, root, startX) {
    var root_width = paper.height * .25;
    var start_x = startX;
    var start_y = Math.floor(.5*paper.height);
    var width = paper.width - root_width;
    var height = 10;
    // TODO: Make the timeline not ugly.
    var line_attr = {"stroke" :"#000", "stroke-width":"3px"};
    var text_attr = {"font-size": "17", "font-family": "Arial, sans-serif", "fill": "#aaa"};
    timeline = paper.path("M" + start_x + "," + start_y + "H" +  paper.width).attr(line_attr);

    // Figure out timeline years and measures.
    // Tick increment will be 1, 5, 10, or 25 depending on the age of the root case.
    var max_year = new Date().getFullYear();
    var min_year = root.year;
    var tick_increment = getTickIncrement(min_year, max_year);
    var first_tick = Math.ceil(min_year / tick_increment) * tick_increment;
    var year_width = max_length/(max_year - min_year);

    // Add tick marks and (angled?) labels.
    for (var year = first_tick; year < max_year; year += tick_increment) {
	var x = root_width + padding + (year-min_year)*year_width;
	paper.path("M" + x + "," + (start_y - 5) + "V" + (start_y + height)).attr(line_attr);
	var t = paper.text(x - 10, start_y + 5, year).attr(text_attr);
	var box = t.getBBox();
	var label_offset = height + Math.SQRT2*box.height/2;
	t.transform("t0," + label_offset+ "r-45");
    }
}

function drawLegend(paper, max_length, root, startX) {
    drawTimeline(paper, max_length, root, startX);
    
    var y = .5*paper.height + 20;
    var text_attrs = {'text-anchor': 'start', 'font-size': '14'};
    var radius = 12;
    // Draw color circles + labels for the court classes
    // TODO: Maybe have mouseover on these highlight the corresponding cases in the graph?
    for (var court in courtColors) {
	    paper.circle(padding + radius, y + padding, radius).attr(
	    {"fill": courtColors[court], "stroke": courtColors[court]});
	    paper.text(2*(radius + padding), y + padding, court).attr(text_attrs);
	    y += 25 + padding;
    }
    
}

function getNodeY(offset, graph_height, radius) {
    var nodeY = offset + radius;
    if (nodeY % graph_height < radius) {
        nodeY += radius * 2;
    }
    if (nodeY % graph_height + radius > graph_height) {
        nodeY += radius * 2;
    } 
    return nodeY % graph_height;
}

function drawTree(paper, root) {
    var root_width = paper.height * .25;
    //background
    paper.rect(0,0,paper.width,paper.height).attr("fill","white").attr("stroke","white");
    var rootCircle = drawRootCir(paper, root);
    var max_radius = root.citedBy.sort(influenceSort)[0].totalCites*radius_scale;
    var max_length = paper.width - root_width - max_radius - 2*padding;
    var y_offset = padding;
    
    drawLegend(paper, max_length, root, rootCircle.attrs.cx + root_width);

    // make the child nodes
    var sorted_cases = root.citedBy.sort(yearSort);
    for(var i in sorted_cases) {
        var c = sorted_cases[i];
        // set size and horiz position of node
        var radius = Math.max(c.totalCites*radius_scale, min_radius);

	var x = root_width + padding + yearScale(c, root)*max_length;
	var y = getNodeY(y_offset, .5*paper.height, radius);
  
	var path_string = "M0," + y + "H0" ;
        var path = paper.path(path_string);
        path.attr({"stroke": "#aaa","stroke-width": "1px"});
        // create node
        // todo: make nodes that are negative (in root.undercutBy) look like bombs 
	// (or otherwise look different)
        var node = paper.circle(0, y, radius).attr("fill",courtColors[c.court]).attr("stroke",courtColors[c.court]);
        var nodeAnim = node.animate({'cx': x}, 1600 * x / paper.width, 'easeOut');
        path.animateWith(node, nodeAnim, {path: "M0," + y + "H" + x}, 1600 * x / paper.width, 'easeOut');
        // let node know about its own case, other metadata
        node.radius = radius;
        node.x = x;
        node.y = y;
        node.c = c;
        node.path = path;
	
	// Add 5 extra to leave room for labels
	y_offset = node.y + radius + padding + 5;
        
        // add animation characteristics
        // show title and glow on hover
        node.hover(function() {
            // todo: make glow and labels fade in and out slightly
            this.g = this.glow({color: "#bbb", width: 8});
            // todo: make labels wrap sanely
            this.caseLabel = paper.text(this.x, this.y + this.radius + 5,
					this.c.label()).attr("fill","#555");
        }, 
                   function() {
		       this.g.hide();
		       this.caseLabel.remove();
                   }); 
        // make nodes with descendants clickable
        if (c.citedBy.length > 0) {
            node.click(function(event) {
                event.preventDefault();
		        parent = root
		        root = this.c
		        root.parent = parent;
		        // reel clicked node back in
                this.g.hide();
                var nodeAnim = this.animate({'cx': 0}, 1000 * this.attrs.cx / paper.width, 'easeOut');
                this.path.animateWith(this, nodeAnim, {path: "M0," + this.attrs.cy + "H0"}, 1000 * this.attrs.cx / paper.width, 'easeOut');
                
                // so that this waits for the animation to finish
                setTimeout(function(){
                    paper.clear();
                    drawTree(paper,root);
                    }, 1000 * this.attrs.cx / paper.width + 50);
            });
        }
        // Chnage cursor for nodes with defendants
        if (c.citedBy.length > 0) {
            node.attr("cursor","pointer");
        }
        
        // TODO: make nodes always on top of lines
    }
    
    // get WP extract
    getExtract(paper,root,root.name,rootCircle.attrs.r);
    
    // redraw root circle and label so it's on top
    drawRootCir(paper, root);
    
};

    
$(document).ready(function() {
    // our first case is Plessy
    var root = plessy;
    // set up Raphael paper, which scales to window size (arguably not the best idea).
    var height = $(window).height() - 2*padding;
    var width = $(window).width() - 2*padding;
    var paper = Raphael(padding, padding,width,height);
    // draw the tree
    drawTree(paper, root);
});
