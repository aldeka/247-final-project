function Case(name, year, court, totalCites) {
    this.name = name;
    this.year = year;
    this.court = court;
    this.totalCites = totalCites;
    this.citedBy = [];
    this.undercutBy = [];

    this.parent = null;

    this.label = function() {
        return this.name + " (" + this.year + ")"
    };
    
    this.addCitation = function(newCase, isNegative) {
        this.citedBy.push(newCase);
        if (isNegative) {
            this.undercutBy.push(newCase);
            }
        }
    
    this.isAfter = function(year) {
        return this.year > year;
    };
    
}

function orderCitations(citeList) {
    // function for ordering citations by year
    citeList.sort(sortByYear);
    return citeList;
    };
    
function sortByYear(caseA,caseB) {
    // for sorting two cases; oldest to newest
    return caseA.year - caseB.year;
    }
    
// types of courts in our data set -- will turn these into colors later, probably  
var courts = ["Supreme Court", "Circuit Court", "District Court", "State Supreme Court", "State Appeals Court"];

var colors = ['#F03B20','#FEC44F', '#fef899', '#8856A7','#9EBCDA', '#ddd'];
// set up courts to colors hash
var courtColors = {};
for(var i in courts) {
    courtColors[courts[i]] = colors[i];
}
    
// Let's make some Cases!

// root case: plessy
plessy = new Case("Plessy v. Ferguson",1896,"Supreme Court",625);

// citations of plessy

tyler = new Case("Tyler v. Harmon", 1925, "State Supreme Court", 12);
plessy.addCitation(tyler,false);

briggs = new Case("Briggs v. Elliott", 1951, "District Court", 16);
plessy.addCitation(briggs,false);

brown = new Case("Brown v. Board", 1955, "Supreme Court", 930);
plessy.addCitation(brown,true);

belk = new Case("Belk v. Charlotte-Mecklenburg Bd. of Educ.", 2001, "Circuit Court", 65)
plessy.addCitation(belk,true);

casey = new Case("Planned Parenthood v. Casey", 1992, "Supreme Court", 1181)
plessy.addCitation(casey,true);

fayson = new Case("Fayson v. Beard", 1955, "District Court", 7)
plessy.addCitation(fayson,false);

regents = new Case("Regents of University of California v. Bakke", 1978, "Supreme Court", 1026);
plessy.addCitation(regents,false);

metro = new Case("Metro Broadcasting, Inc. v. F.C.C.", 1990, "Supreme Court", 168);
plessy.addCitation(metro, false); 

perez = new Case("Perez v. Lippold", 1948, "State Supreme Court", 82);
plessy.addCitation(perez, false);


// citations of tyler
leopold = new Case("Leopold Weil Building & Improvement Co. v. Heiman", 1928, "State Supreme Court", 0);
tyler.addCitation(leopold, false);

richmond = new Case("City of Richmond v. Deans", 1930, "Circuit Court", 11);
tyler.addCitation(richmond, false);

// citations of belk
cavalier = new Case("Cavalier ex rel. Cavalier v. Caddo Parish School Bd.", 2005, "Circuit Court", 7);
belk.addCitation(cavalier, false);

southern = new Case("Southern States Rack And Fixture, Inc. v. Sherwin-Williams Co.", 2003, "Circuit Court", 162);
belk.addCitation(southern, false);

// citations of casey

brizzi = new Case("Clinic for Women v. Brizzi", 2005, "State Supreme Court", 9);
casey.addCitation(brizzi,true);

stuart = new Case("Stuart v. Huff", 2011, "District Court", 1);
casey.addCitation(stuart,true);

neely = new Case("Planned Parenthood v. Neely", 1992, "District Court", 12);
casey.addCitation(neely, false);

williams = new Case("Planned Parenthood v. Williams", 1993, "State Appeals Court", 1);
casey.addCitation(williams, true);

berquist = new Case("People v. Berquist", 1993, "State Appeals Court", 7);
casey.addCitation(berquist, false);

compassion = new Case("Compassion In Dying v. State of Wash.", 1996, "Circuit Court", 21);
casey.addCitation(compassion, true);

okpalobi = new Case("Okpalobi v. Foster", 2001, "Circuit Court", 110);
casey.addCitation(okpalobi, true);

// citations of okpalobi

leblanc = new Case("K.P v. LeBlanc", 2010, "Circuit Court", 10);
okpalobi.addCitation(leblanc, true);

womens = new Case("Women's Medical Professional Corp. v. Taft", 2001, "District Court", 1);
okpalobi.addCitation(womens, false);

foti = new Case("Hamilton v. Foti", 2010, "Circuit Court", 4);
okpalobi.addCitation(foti, false);

womens2 = new Case("Women's Health Clinic v. State", 2002, "State Appeals Court", 1);
okpalobi.addCitation(womens2, false);

bronson = new Case("Bronson v. Swenson", 2007, "Circuit Court", 126);
okpalobi.addCitation(bronson, false);

rushing = new Case("Rushing v. Board", 2008, "District Court", 2);
okpalobi.addCitation(rushing, true);

// citations of brown

brown.addCitation(belk, false);

fordice = new Case("US v. Fordice", 1992, "Supreme Court", 98);
brown.addCitation(fordice, false);

deal = new Case("Deal v. Cincinnati Bd. of Ed.", 1969, "Circuit Court", 38);
brown.addCitation(deal, false);

penick = new Case("Columbia Bd. of Ed. v. Penick", 1979, "Supreme Court", 245);
brown.addCitation(penick, false);

cooper = new Case("Cooper v. Aaron", 1958, "Supreme Court", 638);
brown.addCitation(cooper, false);

eslinger = new Case("Eslinger v. Thomas", 1972, "District Court", 2);
brown.addCitation(eslinger, false);

// citations of regents
regents.addCitation(belk, true);

johnson = new Case("Johnson v. Board of Regents of University of Georgia", 2001, "Circuit Court", 169);
regents.addCitation(johnson, true);

peters = new Case("Peters v. Moses", 1985, "District Court", 1);
regents.addCitation(peters, true);

grutter = new Case("Grutter v. Bollinger", 2003, "Supreme Court", 274);
regents.addCitation(grutter);

gratz = new Case("Gratz v. Bollinger", 2003, "Supreme Court", 163);
regents.addCitation(gratz);

voltage = new Case("Hi-Voltage Works, Inc. v. City of San Jose", 2000, "State Supreme Court", 40);
regents.addCitation(voltage);


