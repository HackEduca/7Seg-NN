
// Mikian & Victor 7 seg NN

const int led = 8;          // LED
int incomingByte;           // reading data from p5

void setup() {
  Serial.begin(9600);       
  pinMode(led, OUTPUT);
}

void loop() {
  incomingByte = Serial.read(); // read it
  delay(100);
  if (incomingByte == '5') {
    digitalWrite(led, HIGH); 
    delay(500);
    incomingByte = 0;
  } else {
    digitalWrite(led, LOW);
  }
   
}
