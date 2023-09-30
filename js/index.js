import Cube from 'https://cdn.skypack.dev/cubejs'
import { Alg } from 'https://cdn.cubing.net/js/cubing/alg'
import { AlgCard } from './algCard.js'

const modelId = "1695482707863"
let frontTemplateRuf = `<script src="https://cdn.cubing.net/js/cubing/twisty" type="module"></script>

<twisty-player
	alg="{{Algorithm}}"
	experimental-setup-alg="{{Pre-Rotation}}"
	experimental-setup-anchor="end"
	visualization="PG3D"
	hint-facelets="none"
	background="none"
	control-panel="none"
	experimental-drag-input="none"
	camera-longitude="35"
	style="margin: auto;"
>
</twisty-player>
<span style="color:#FF8080">{{Pre-Rotation}} </span>{{Scramble}}`

let frontTemplateLfu = `<script src="https://cdn.cubing.net/js/cubing/twisty" type="module"></script>

<twisty-player
	alg="{{Algorithm}}"
	experimental-setup-alg="{{Pre-Rotation}}"
	experimental-setup-anchor="end"
	visualization="PG3D"
	hint-facelets="none"
	background="none"
	control-panel="none"
	experimental-drag-input="none"
	camera-longitude="-35"
	style="margin: auto;"
>
</twisty-player>
<span style="color:#FF8080">{{Pre-Rotation}} </span>{{Scramble}}`

let frontTemplateLl = `<script src="https://cdn.cubing.net/js/cubing/twisty" type="module"></script>

<twisty-player
	alg="{{Algorithm}}"
	experimental-setup-alg="{{Pre-Rotation}}"
	experimental-setup-anchor="end"
	visualization="experimental-2D-LL"
	hint-facelets="none"
	background="none"
	control-panel="none"
	experimental-drag-input="none"
	style="margin: auto;"
>
</twisty-player>
<span style="color:#FF8080">{{Pre-Rotation}} </span>{{Scramble}}`

let frontTemplateNone = `<span style="color:#FF8080">{{Pre-Rotation}} </span>{{Scramble}}`

let backTemplate = `{{FrontSide}}
<hr id=answer>
{{Case Name}}:<br>
{{Algorithm}}<br>
Note: {{Note}}
`

function textInterpreter(textLines) {
  let tags = []
  let algs = []
  let algNumber = 0;
  for(let line of textLines) {
    if(line.includes("#")) {
      const rawTag = line.replace(/#/g, '').trim()
      const tagDepth = (line.match(/#/g)||[]).length - 1;
      tags[tagDepth] = rawTag;
      tags.length=tagDepth + 1
    } else if(line.includes(":")) {
      const indexColon = line.indexOf(":");
      let alg = "";
      let note = "";
      if(line.includes("*")) {
        const indexAsterisk = line.indexOf("*")
        alg = line.substring(indexColon + 1, indexAsterisk).trim();
        note = line.substring(indexAsterisk + 1).trim();
      } else {
        alg = line.substring(indexColon + 1).trim();
      }
      const algName = line.substring(0,indexColon);
      const algObject = new AlgCard(algName, alg, note, [...tags]);
      algs.push(algObject);
    } else {
      algNumber ++;
      let alg = "";
      let note = "";
      if(line.includes("*")) {
        const indexAsterisk = line.indexOf("*")
        alg = line.substring(indexAsterisk).trim();
        note = line.substring(indexAsterisk + 1).trim();
      } else {
        alg = line.trim();
      }
      const algName = "#" + algNumber;
      const algObject = new AlgCard(algName, alg, note, [...tags]);
      algs.push(algObject)
    }
  }

  return algs;
}

function calculateScrambles(algs) {
  Cube.initSolver()

  const cube = new Cube();
  for(let alg of algs){
    cube.identity();
    
    const algNormalized = (new Alg(alg.alg)).expand().toString();

    cube.move(algNormalized);
    const result = cube.solve();
    alg.scramble = result;
  }
  return algs;
}

function generatePackage(algs, deckName, imageType, preRotations) {
  let deck = new Deck(+new Date, deckName);
  if(imageType = "none") {
    for(let alg of algs) {
      deck.addNote(noneModel.note(alg.name, alg.alg, alg.note, alg.scramble, preRotations));
    }
  } else if(imageType = "u") {
    for(let alg of algs) {
      console.log(alg)
      deck.addNote(noneModel.note(alg.name, alg.alg, alg.note, alg.scramble, preRotations));
    }
  } else if(imageType = "RUF") {
    for(let alg of algs) {
      deck.addNote(noneModel.note(alg.name, alg.alg, alg.note, alg.scramble, preRotations));
    }
  } else if(imageType = "LFU") {
    for(let alg of algs) {
      deck.addNote(noneModel.note(alg.name, alg.alg, alg.note, alg.scramble, preRotations));
    }
  }
  return deck;
}
function formSubmit() {
  console.log('Form submitted')

  const name = document.getElementById('name-input').value;
  const textLines = document.getElementById('alg-input').value.split("\n");
  const preRotations = document.getElementById('pre-rotation').value;
  const imageType = document.getElementById('image-type').value;

  const algs = textInterpreter(textLines);

  const algCards = calculateScrambles(algs);
  
  const ankiPackage = generatePackage(algCards, name, "u", preRotations);

  const fileName = name.replace(/ /g, "_").toLowerCase();

  ankiPackage.writeToFile(fileName);
}

let config = {
  locateFile: filename => `js/sql/sql-wasm.wasm`
}

let SQL;
window.SQL;
window.initSqlJs(config).then(function (sql) {
    window.SQL = sql;
});

let rufModel = new Model({
  name: "Algorithm",
  id: modelId,
  flds: [
    { name: "Case Name" },
    { name: "Algorithm" },
    { name: "Note"},
    { name: "Scramble"},
    { name: "Pre-Rotation"}
  ],
  req: [
    [ 0, "any", [0, 1, 2, 3, 4] ]
  ],
  tmpls: [
    {
      name: "Card 1",
      qfmt: frontTemplateRuf,
      afmt: backTemplate,
    }
  ],
})
let lfuModel = new Model({
  name: "Algorithm",
  id: modelId,
  flds: [
    { name: "Case Name" },
    { name: "Algorithm" },
    { name: "Note"},
    { name: "Scramble"},
    { name: "Pre-Rotation"}
  ],
  req: [
    [ 0, "any", [0, 1, 2, 3, 4] ]
  ],
  tmpls: [
    {
      name: "Card 1",
      qfmt: frontTemplateLfu,
      afmt: backTemplate,
    }
  ],
})
let llModel = new Model({
  name: "Algorithm",
  id: modelId,
  flds: [
    { name: "Case Name" },
    { name: "Algorithm" },
    { name: "Note"},
    { name: "Scramble"},
    { name: "Pre-Rotation"}
  ],
  req: [
    [ 0, "any", [0, 1, 2, 3, 4] ]
  ],
  tmpls: [
    {
      name: "Card 1",
      qfmt: frontTemplateLl,
      afmt: backTemplate,
    }
  ],
})
let noneModel = new Model({
  name: "Algorithm",
  id: modelId,
  flds: [
    { name: "Case Name" },
    { name: "Algorithm" },
    { name: "Note"},
    { name: "Scramble"},
    { name: "Pre-Rotation"}
  ],
  req: [
    [ 0, "any", [0, 1, 2, 3, 4] ]
  ],
  tmpls: [
    {
      name: "Card 1",
      qfmt: frontTemplateNone,
      afmt: backTemplate,
    }
  ],
})

document.getElementById("generate-button").addEventListener('click', formSubmit);

//let deck = new Deck(+new Date, "Test Deck")
//
//deck.addNote(model.note(['Ub-Perm',"M2 U' M U2 M' U' M2", "L' F D' L2 F2 R2 D2 R2 U R2 U' B2 U' R2 F2 U' F' L U' L U' L' U", "x2"]))
//
//let ankiPackage = new Package()
//ankiPackage.addDeck(deck)
