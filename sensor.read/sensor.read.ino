// these constants describe the pins. They won't change:
const int flex1 = A0; 
const int flex2 = A1; 
const int flex3 = A2; 
const int flex4 = A3; 
const int potpin = A4; 
const int potpin2 = A5; 
int potvalue;
int potvalue2;
//                
//int xValue;
//int yValue;
//
//int xMap;
//int yMap;
//
int sampleDelay = 500;   //number of milliseconds between readings
void setup()
{
 // initialize the serial communications:
 Serial.begin(9600);
 //
 //Make sure the analog-to-digital converter takes its reference voltage from
 // the AREF pin
 pinMode(flex1, INPUT);
  pinMode(flex2, INPUT);
   pinMode(flex3, INPUT);
    pinMode(flex4, INPUT);
    pinMode(potpin, INPUT);

}
void loop()
{
 int flexsensor1 = analogRead(flex1);
   delay(1); 
   int flexsensor2 = analogRead(flex2);
   delay(1); 
   int flexsensor3 = analogRead(flex3);
   delay(1); 
   int flexsensor4 = analogRead(flex4);
   delay(1); 
   int potentiometer = analogRead(potpin);
   delay(1); 
   int potentiometer2 = analogRead(potpin2);
   delay(1); 

//map(value, fromLow, fromHigh, toLow, toHigh)
   potvalue = map(potentiometer, 1, 1023, -2, 10);
   potvalue2 = map(potentiometer2, 1, 1023, 0, 100);
 

Serial.print(flexsensor1);
Serial.print(",");
Serial.print(flexsensor2);
Serial.print(",");
Serial.print(flexsensor3);
Serial.print(",");
Serial.print(flexsensor4);
Serial.print(",");
Serial.print(potvalue);
Serial.print(",");
Serial.print(potvalue2);
Serial.println();


 //
 // delay before next reading:
 delay(1000);
}
