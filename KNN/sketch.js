let video;
let features;
let knn;
let labelP;
let ready = false;
let x;
let y;
let label = 'nothing';

var serial;          // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem14201';  // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino
var outData = 0;  // variable to hold the output data to Arduino

var numSent = 0;

function setup() {
  createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  features = ml5.featureExtractor('MobileNet', modelReady);
  knn = ml5.KNNClassifier();
  labelP = createP('need training data');
  labelP.style('font-size', '32pt');
  x = width / 2;
  y = height / 2;

  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing

  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port

  setInterval(
    function(){
      console.log(numSent);
      serial.write((numSent)+"");
    }
  ,1000);

}

function goClassify() {
  const logits = features.infer(video);
  knn.classify(logits, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      label = result.label;
      numSent = label;
      labelP.html(result.label);
      goClassify();
    }
  });
}

function keyPressed() {
  const logits = features.infer(video);
  if (key == '0') {
    knn.addExample(logits, '0');
    console.log('0');
  } else if (key == '1') {
    knn.addExample(logits, '1');
    console.log('1');
  } else if (key == '2') {
    knn.addExample(logits, '2');
    console.log('2');
  } else if (key == '3') {
    knn.addExample(logits, '3');
    console.log('3');
  } else if (key == '4') {
    knn.addExample(logits, '4');
    console.log('4');
  } else if (key == '5') {
    knn.addExample(logits, '5');
    console.log('5');
  } else if (key == '6') {
    knn.addExample(logits, '6');
    console.log('6');
  } else if (key == '7') {
    knn.addExample(logits, '7');
    console.log('7');
  } else if (key == '8') {
    knn.addExample(logits, '8');
    console.log('8');
  } else if (key == '9') {
    knn.addExample(logits, '9');
    console.log('9');
  } else if (key == 's') {
    save(knn, 'model.json');
  }
}

function modelReady() {
  console.log('model ready!');
  knn.load('model1.json', function() {
    console.log('knn loaded');
  });
}

function draw() {
  background(0);
  fill(255);

  if (!ready && knn.getNumLabels() > 0) {
    goClassify();
    ready = true;
  }
}

// Temporary save code until ml5 version 0.2.2
const save = (knn, name) => {
  const dataset = knn.knnClassifier.getClassifierDataset();
  if (knn.mapStringToIndex.length > 0) {
    Object.keys(dataset).forEach(key => {
      if (knn.mapStringToIndex[key]) {
        dataset[key].label = knn.mapStringToIndex[key];
      }
    });
  }
  const tensors = Object.keys(dataset).map(key => {
    const t = dataset[key];
    if (t) {
      return t.dataSync();
    }
    return null;
  });
  let fileName = 'myKNN.json';
  if (name) {
    fileName = name.endsWith('.json') ? name : `${name}.json`;
  }
  saveFile(fileName, JSON.stringify({
    dataset,
    tensors
  }));
};

const saveFile = (name, data) => {
  const downloadElt = document.createElement('a');
  const blob = new Blob([data], {
    type: 'octet/stream'
  });
  const url = URL.createObjectURL(blob);
  downloadElt.setAttribute('href', url);
  downloadElt.setAttribute('download', name);
  downloadElt.style.display = 'none';
  document.body.appendChild(downloadElt);
  downloadElt.click();
  document.body.removeChild(downloadElt);
  URL.revokeObjectURL(url);
};


function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
 print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialEvent() {
  // inData = Number(serial.read());
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}
