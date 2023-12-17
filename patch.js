function loadjpg_onclick() {
    console.log("loadjpg_onclick");
    document.getElementById('file').click();
}
// Ensure that the DOM is fully loaded before trying to access elements

// A $( document ).ready() block.
$(document).ready(function () {
    console.log("ready!");
    document.getElementById('file').onchange = function (e) {
        document.getElementById('JPGfileName').innerText = e.target.files[0].name;
        //load image to id='x'
        var reader = new FileReader();
        reader.onload = function (event) {
            $('#x').attr('src', event.target.result);
            // Get the image element
            var myImage = document.getElementById('x');

            // Set up an onload event handler
            myImage.onload = function () {
                // Get the width and height of the image
                var imageWidth = myImage.width;
                var imageHeight = myImage.height;

                // Log the dimensions
                console.log('Image Width:', imageWidth);
                console.log('Image Height:', imageHeight);

                // Create a new <p> element
                var newParagraph = document.createElement('div');

                // Set the text content of the <p> element
                newParagraph.innerHTML = `
                <form class="container" name="demo">

        <div class="explain">
            opentype.js is an OpenType and TrueType font parser and writer.
            It allows you to access the <strong>letterforms</strong> of text from the browser or node.js.
        </div>

        <input id="file" type="file">
        <output class="info" name="fontname"></output>
        <canvas id="preview" width="${imageWidth}" height="${imageHeight}" class="text"></canvas>
        <output id="message"></output>
        <input class="text-input" value="Hello, World!" autofocus name="textField">
        <label>Font Size<input type="range" min="6" max="500" step="2" value="150" name="fontsize" autocomplete="off"
                oninput="nextElementSibling.innerText=value"><output>150</output></label>
        <label><input type="checkbox" name="drawPoints">Draw Points</label>
        <label><input type="checkbox" name="drawMetrics">Draw Metrics</label>
        <label><input type="checkbox" name="kerning" checked="checked">Kerning</label>
        <label><input type="checkbox" name="ligatures" checked="checked">Ligatures</label>
        <label class="disabled"><input name="hinting" type="checkbox" onchange="hintingChanged(this)"
                disabled="true">Hinting</label>

        <hr>

        <div class="explain">
            Once you have the shapes, you can modify them, for example by <strong>snapping</strong> them to a virtual
            grid:
        </div>

        <canvas id="snap" width="940" height="300" class="text"></canvas>
        <label>Strength <input type="range" min="0" max="100" value="80" name="snapStrength"
                oninput="nextElementSibling.innerText=value" /><output>80</output></label>
        <label>Distance<input type="range" min="1" max="100" value="53" name="snapDistance"
                oninput="nextElementSibling.innerText=value" /><output>53</output></label>
        <label>X<input type="range" min="-100" max="100" value="0" name="snapX"
                oninput="snextElementSibling.innerText=value" /><output>0</output></label>
        <label>Y<input type="range" min="-100" max="100" value="0" name="snapY"
                oninput="snextElementSibling.innerText=value" /><output>0</output></label>

        <hr>

        <div class="explain">
            <h1>Glyphs</h1>
            opentype.js provides you with <strong>raw access</strong> to the glyphs so you can modify them as you
            please.
        </div>

        <div id="glyphs">
        </div>
        <div class="message">Only the first 100 glyphs are shown.</div>

        <hr>

        <div class="explain">
            <h1>Free Software</h1>
            <p>opentype.js is available on <a href="https://github.com/opentypejs/opentype.js">GitHub</a> under the <a
                    href="https://raw.github.com/opentypejs/opentype.js/master/LICENSE">MIT License</a>.</p>
            <p>Copyright &copy; 2020 Frederik De Bleser.</p>
        </div>

        <hr>
    </form>
                `;

                // Append the <p> element to the end of the <body> element
                document.body.appendChild(newParagraph);

                form = document.forms.demo;
                form.oninput = renderText;
                form.file.onchange = function (e) {
                    display(e.target.files[0], e.target.files[0].name);
                };
                enableHighDPICanvas('preview');
                enableHighDPICanvas('snap');

            };
        }
        reader.readAsDataURL(e.target.files[0]);

    };
});