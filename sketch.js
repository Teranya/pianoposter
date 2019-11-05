var sensor1;
var sensor2;
var sensor3;
var sensor4;
var sensor5;
var sensor6;
var sensor7;
var sensor8;
var sensor9;
var sensor10;
var sensor11;

let noteb1;
let noteb2;
let noteb3;
let noteb4;
let noteb5;
let noteb6;
let noteb7;
let notec1;
let notec2;
let notec3;
let notec4;

let counter = 0;

let noise, env, delay, reverb;

var distortion;

//  variables for calculating easing 
let y = 0;
let easing = 0.05;

//for fft
var volhistory = [];
//var w;

//DOM editing

let createP1;
let createP2;

//scribble instance

var scribble = new Scribble(); // global mode

var serial; // variable to hold an instance of the serialport library
var options = {
    baudRate: 9600
}; //  baudrate set to 9600 to  match Arduino baudrate



//preload all the audio files from assets folder
function preload() {
    noteb1 = loadSound('assets/crystal/B1.mp3');
    noteb2 = loadSound('assets/crystal/B2.mp3');
    noteb3 = loadSound('assets/crystal/B3.mp3');
    noteb4 = loadSound('assets/crystal/B4.mp3');
    noteb5 = loadSound('assets/crystal/B5.mp3');
    noteb6 = loadSound('assets/crystal/B6.mp3');
    noteb7 = loadSound('assets/crystal/B7.mp3');
    notec1 = loadSound('assets/glockenspiel/C1.mp3');
    notec2 = loadSound('assets/glockenspiel/C2.mp3');
    notec3 = loadSound('assets/glockenspiel/A0.mp3');
    notec4 = loadSound('assets/glockenspiel/A1.mp3');
}

function setup() {
    //    createCanvas(windowHeight, windowWidth);
    createCanvas(1200, 2000);

    //    set color mode

    colorMode(HSB);

    angleMode(DEGREES);

    // Instantiate our SerialPort object
    serial = new p5.SerialPort();

    // Creates a list the ports available in console
    serial.list();

    // Connect to the serial port the Arduino is on
    serial.open("/dev/tty.usbmodem14201");

    serial.on('connected', serverConnected);
    serial.on('list', gotList);
    serial.on('data', gotData);
    // If code throws error  
    serial.on('error', gotError);

    // When our serial port is opened and ready for read/write
    serial.on('open', gotOpen);
    serial.on('close', gotClose);


    // Start a new amplitude instance for the tracks

    amplitude = new p5.Amplitude();

    // Start a new reverb instance for the tracks

    reverb = new p5.Reverb();

    // Start a new delay instance for the tracks

    delay = new p5.Delay();

    // start a new Fast Fourier Transform

    fft = new p5.FFT(0.5, 64);
    //    w = width / 64;

    //add the delay process for the notes
    delay.process(notec1, 0.9, .7, 2300);
    delay.process(notec2, 0.9, .7, 2300);
    delay.process(notec3, 0.9, .7, 2300);
    delay.process(notec4, 0.9, .7, 2300);

}



// We are connected and ready to go
function serverConnected() {
    print("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
    print("List of Serial Ports:");
    // theList is an array of their names
    for (let i = 0; i < thelist.length; i++) {
        // Display in the console
        print(i + " " + thelist[i]);
    }
}

// Connected to our serial device

function gotOpen() {
    print("Serial Port is Open");
}

function gotClose() {
    print("Serial Port is Closed");
    latestData = "Serial Port is Closed";
}

// Log error in console if something crops up
function gotError(theerror) {
    print(theerror);
}


function gotData() {
    //    create a string that reads the entire line of sensor data from Arduino
    var inString = serial.readLine();
    // split the incoming data at every comma 
    if (inString.length > 0) {
        var splitString = split(inString, ',');
        // connecting the varous splits into different variables
        sensor1 = Number(splitString[0]);
        sensor2 = Number(splitString[1]);
        sensor3 = Number(splitString[2]);
        sensor4 = Number(splitString[3]);
        sensor5 = Number(splitString[4]);
        sensor6 = Number(splitString[5]);
        sensor7 = Number(splitString[6]);
        sensor8 = Number(splitString[7]);
        sensor9 = Number(splitString[8]);
        sensor10 = Number(splitString[9]);
        sensor11 = Number(splitString[10]);

    }


}

// We got raw from the serial port
function gotRawData(thedata) {
    print("gotRawData" + thedata);
}


function draw() {

    clear(); //no background colour
    //    backgournd(0);

    let level = amplitude.getLevel();
    let size = map(level, 0, 1, 0, 200);


    let spectrum = fft.analyze();
    noStroke();
    strokeWeight(1);
    //    stroke(255, 0, 0);
    translate(width / 2, height / 2);
    beginShape();
    for (var i = 0; i < spectrum.length; i++) {
        var angle = map(i, 0, spectrum.length, 0, 360);
        var amp = spectrum[i];
        var r = map(amp, 0, 256, 20, 200);
        //        fill(i, 255, 255);
        var x = r * cos(angle);
        var y = r * sin(angle);

        stroke(0, 0, i, i * 0.01);
        line(0, 0, x * 2, y * 2);
        //        vertex(x * 2, y * 2);
        //        var y = map(amp, 0, 256, height, 0);

        //        rect(i * w, y, w - 2, height - y);
    }

    endShape();
    //    fill(0);
    fill(0, 0, 0, 0.5);
    noStroke();
    //        stroke(255, 204, 0);
    //   print all the values of the sensors
    text("Sensor values:", -500, -90);
    text("sensor1: " + (sensor1), -500, -75);
    text("sensor2: " + (sensor2), -500, -60);
    text("sensor3: " + (sensor3), -500, -45);
    text("sensor4: " + (sensor4), -500, -30);
    text("sensor5: " + (sensor5), -500, -15);
    text("sensor6: " + (sensor6), -500, 0);
    text("sensor7: " + (sensor7), -500, 15);
    text("sensor8: " + (sensor8), -500, 30);
    text("sensor9: " + (sensor9), -500, 45);
    text("sensor10: " + (sensor10), -500, 60);
    text("sensor11: " + (sensor11), -500, 75);


    //    PLAY NOTES when a sensor is above a threshold

    text("Notes playing:", 400, -90);
    if (sensor1 > 60) {
        noteb1.play();
        text("Note B1", 400, -60);
    }
    if (sensor2 > 60) {
        noteb2.play();
        text("Note B2", 400, -45);

    }
    if (sensor3 > 60) {
        noteb3.play();
        text("Note B3", 400, -30);

    }
    if (sensor4 > 60) {
        noteb4.play();
        text("Note B4", 400, -15);

    }
    if (sensor5 > 60) {
        noteb5.play();
        text("Note B5", 400, 0);
    }
    if (sensor6 > 60) {
        noteb6.play();
        text("Note B6", 400, 15);

    }
    if (sensor7 > 60) {
        noteb7.play();
        text("Note B7", 400, 30);

    }
    if (sensor8 > 60) {
        notec1.play();
        text("glockenspiel C1", 400, 60);

    }
    if (sensor9 > 60) {
        notec2.play();
        text("glockenspiel C2", 400, 75);
    }
    if (sensor10 > 60) {
        notec3.play();
        text("glockenspiel C3", 400, 90);
        //        delay.process(noteb1, 0.01, 0.5, 3000);
        //        delay.process(noteb2, 0.01, 0.5, 3000);
        //        delay.process(noteb3, 0.01, 0.5, 3000);
        //        delay.process(noteb4, 0.01, 0.5, 3000);
        //        delay.process(noteb5, 0.01, 0.5, 3000);
        //        delay.process(noteb6, 0.01, 0.5, 3000);

    }
    if (sensor11 > 60) {
        notec4.play();
        text("glockenspiel C4", 400, 105);
        //        delay.process(noteb1, 0.14, 0.5, 2300);
        //        delay.process(noteb2, 0.14, 0.5, 2300);
        //        delay.process(noteb3, 0.14, 0.5, 2300);
        //        delay.process(noteb4, 0.14, 0.5, 2300);
        //        delay.process(noteb5, 0.14, 0.5, 2300);
        //        delay.process(noteb6, 0.14, 0.5, 2300);

    }





    let size2 = map(level, 0, 1, 0, 500);
    text("Amplitude Visualizer 2: ", -500, 100);
    scribble.bowing = 5;
    scribble.roughness = 5;
    scribble.numEllipseSteps = 20;
    strokeWeight(1);
    stroke(0, 0, 0, 0.5);

    noFill();
    scribble.scribbleEllipse(-390, 200, size2 * 2, size2 * 2);
    scribble.scribbleEllipse(390, 200, size2 * 1.5, size2 * 1.5);
    //    ellipse(width / 2, height / 2, size, size);





    //    if (sensor3 > 300) {
    //        noted.play();
    //    } else {
    //        noted.stop();
    //    }
    //    if (sensor4 > 300) {
    //        notef.play();
    //    } else {
    //        notef.stop();
    //    }









    //    let spectrum = fft.analyze();
    //    noStroke();
    //    fill(0, 102, 153); // spectrum is green
    //    for (var i = 0; i < spectrum.length; i++) {
    //        let x = map(i, 0, spectrum.length, 0, width);
    //        let h = -height + map(spectrum[i], 0, 255, height, 0);
    //        rect(x, height, width / spectrum.length, h / 2)
    //    }


    // create a waveform based on audio frequencies within whats playing
    //
    //        let waveform = fft.waveform();
    //        noFill();
    //        beginShape();
    //        stroke(255, 255, 255); // waveform is red
    //        strokeWeight(3);
    //
    //        for (var i = 0; i < waveform.length; i++) {
    //            let x = map(i, 0, waveform.length, 0, width);
    //            let y = map(waveform[i], -1, 1, 0, height);
    //            vertex(x / 2, y);
    //
    //
    //        }
    //    endShape();


}



// backup notes played based on keyboard type

function keyTyped() {
    if (key === 'a') {
        notec1.play();
    } else if (key === 's') {
        notec2.play();
    } else if (key === 'd') {
        notec3.play();
    } else if (key === 'f') {
        notec4.play();
    }

}
