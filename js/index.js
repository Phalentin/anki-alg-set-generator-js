import Cube from 'https://cdn.skypack.dev/cubejs'
import { Alg } from 'https://cdn.cubing.net/js/cubing/alg'

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
`
function setup() {
  let config = {
    locateFile: filename => `js/sql/sql-wasm.wasm`
  }

  let SQL;
  initSqlJs(config).then(function (sql) {
      SQL = sql;
  });

  let rufModel = new Model({
      name: "Algorithm",
      id: modelId,
      flds: [
        { name: "Case Name" },
        { name: "Algorithm" },
        { name: "Scramble"},
        { name: "Pre-Rotation"}
      ],
      req: [
        [ 0, "any", [0, 1, 2, 3] ]
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
        { name: "Scramble"},
        { name: "Pre-Rotation"}
      ],
      req: [
        [ 0, "any", [0, 1, 2, 3] ]
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
        { name: "Scramble"},
        { name: "Pre-Rotation"}
      ],
      req: [
        [ 0, "any", [0, 1, 2, 3] ]
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
        { name: "Scramble"},
        { name: "Pre-Rotation"}
      ],
      req: [
        [ 0, "any", [0, 1, 2, 3] ]
      ],
      tmpls: [
        {
          name: "Card 1",
          qfmt: frontTemplateNone,
          afmt: backTemplate,
        }
      ],
    })
}

function formSubmit() {
  console.log('Form submitted')

  const name = document.getElementById('name-input').value;
  const textLines = document.getElementById('alg-input').value.split("\n");
  const preRotations = document.getElementById('pre-rotation').value;
  const imageType = document.getElementById('image-type').value;

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
      const algName = line.substring(0,indexColon);
      const alg = line.substring(indexColon + 1).trim();
      const algTuple = [algName, alg, [...tags]];
      algs.push(algTuple);
    } else {
      algNumber ++;
      const algName = "#" + algNumber;
      const algTuple = [algName, line, [...tags]];
      algs.push(algTuple)
    }
  }
  Cube.initSolver()

  const cube = new Cube();
  for(let alg of algs){
    cube.identity();
    
    const algNormalized = (new Alg(alg[1])).expand().toString();

    cube.move(algNormalized);
    const result = cube.solve();
    alg.push(result);
  }
  console.log(algs);
}

setup()

document.getElementById("generate-button").addEventListener('click', formSubmit);

//let deck = new Deck(+new Date, "Test Deck")
//
//deck.addNote(model.note(['Ub-Perm',"M2 U' M U2 M' U' M2", "L' F D' L2 F2 R2 D2 R2 U R2 U' B2 U' R2 F2 U' F' L U' L U' L' U", "x2"]))
//
//let ankiPackage = new Package()
//ankiPackage.addDeck(deck)
