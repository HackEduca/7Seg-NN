#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver();

#define MIN_PULSE_WIDTH 650
#define MAX_PULSE_WIDTH 2350
#define DEFAULT_PULSE_WIDTH 1500
#define FREQUENCY 50

uint8_t servonum = 0;

int BCDToSS[16][7] = {
  {1,0,0,1,0,0,1}, // 0
  {0,0,0,0,1,1,1}, // 1
  {1,0,1,1,0,1,0}, // 2
  {1,0,0,1,1,1,0}, // 3
  {0,0,0,0,1,0,0}, // 4
  {1,1,0,1,1,0,0}, // 5
  {1,1,0,1,0,0,0}, // 6
  {1,0,0,0,1,1,1}, // 7
  {1,0,0,1,0,0,0}, // 8
  {1,0,0,1,1,0,0}, // 9
  {1,0,0,0,0,0,0}, // A
  {0,1,0,1,0,0,0}, // B
  {1,1,1,1,0,0,1}, // C
  {0,0,0,1,0,1,0}, // D
  {1,1,1,1,0,0,0}, // E
  {1,1,1,0,0,0,0}  // F
};

void setup() {
  Serial.begin(9600);
  Serial.println("16 channel Servo test!");
  pwm.begin();
  pwm.setPWMFreq(FREQUENCY);
}
int pulseWidth(int angle) {
  int pulse_wide, analog_value;
  pulse_wide = map(angle, 0, 180, MIN_PULSE_WIDTH, MAX_PULSE_WIDTH);
  analog_value = int(float(pulse_wide) / 1000000 * FREQUENCY * 4096);
  Serial.println(analog_value);
  return analog_value;
}

void setNum(int num) {
  int offset = 9;
  for(int i = 0; i < 7; i++){
    pwm.setPWM(i + offset, 0, pulseWidth(BCDToSS[num][i] * 90));
  }
}

void loop() {
//  for(int j = 0; j < 16; j++) {
//    setNum(j);
//    delay(1000);
//  }
}
