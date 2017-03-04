// Baha'i date displayer
// Original code by Glen Little. Developed in April 1999 / Splendor 156

// Version 1.0

// function to construct a BahaiDateV1 object
function BahaiDateV1(timeToConvert, longitude, latitude)
 {
  var now = 'x'

  if(typeof(timeToConvert)=='string')  // given a string, convert to date
   {
    now = new Date()
    now.setTime(Date.parse(timeToConvert))
   }

  if(isNaN(now))   // wasn't a string, or a valid string
   {
    if(isNaN(timeToConvert))    // nothing given, use current date/time
     {
      now = new Date()
     }
    else  // is a number or date
     if(timeToConvert.constructor==Date)  // valid date
      {
       now = new Date(timeToConvert.getTime())
      }
     else   // number of ms
      {
       now = new Date()
       now.setTime(timeToConvert)
      }
   }

  if(now==null) return   // nothing worked, return null

    // store gregorian date/time in object for later use
  this.gDateTime = new Date(now.getTime())

    // determine the year
  var gYear = now.getFullYear()

    // determine some important dates
  var NawRuz = new Date(gYear,2,20)
      NawRuz.sunset(longitude, latitude)
      NawRuz.normalize(now)

  var lastNawRuz = new Date(gYear-1,2,20)
      lastNawRuz.sunset(longitude, latitude)
      lastNawRuz.normalize(now)

  var Loftiness1 = new Date(gYear,2,1)
      Loftiness1.sunset(longitude, latitude)
      Loftiness1.normalize(now)

  var AyyamiHa1 = new Date(gYear,1,25)
      AyyamiHa1.sunset(longitude, latitude)
      AyyamiHa1.normalize(now)

    // determine last sunset.
  var gDateSunset = new Date(now.getTime())
      gDateSunset.sunset(longitude, latitude)

    // if sun not set, use yesterday's sunset
  if(now < gDateSunset)
   {
    gDateSunset.setDate(gDateSunset.getDate()-1)
    gDateSunset.sunset(longitude, latitude)
   }
  gDateSunset.normalize(now)

    // calculate today
  var afterNawRuz = (gDateSunset >= NawRuz)

    // do what we can with the year
  this.year = gYear - 1844 + afterNawRuz
  this.vahid = 1 + (this.year / 19)
  this.kullishay = 1 + (this.vahid / 19)

    // determine what month and day this is, based on last sunset
  if     (afterNawRuz)              { var sectionStart = NawRuz }
  else if(gDateSunset < AyyamiHa1)  { var sectionStart = lastNawRuz }
  else if(gDateSunset >= Loftiness1){ var sectionStart = Loftiness1 }
  else                              { var sectionStart = AyyamiHa1 }

  if     (sectionStart==Loftiness1) { this.month = 19 }
  else if(sectionStart==AyyamiHa1)  { this.month = 0 }
  else                              { this.month = 1 + (((gDateSunset - sectionStart) * msToDays) / 19) }

  this.day = 1 + (((gDateSunset - sectionStart) * msToDays) % 19)

    // time since sunset
  this.hours = ((now - gDateSunset)) * msToDays * 24
  this.minutes = (this.hours - Math.floor(this.hours)) * 60
  this.seconds = (this.minutes - Math.floor(this.minutes)) * 60

  // truncate all the numbers
  for(e in this)
   {
    if(!isNaN(this[e])) { this[e]=Math.floor(this[e]) }
   }
 }


//----- Misc functions to make using a BahaiDateV1 object easier

BahaiDateV1.prototype.toString = function()
 {
  return this.year + '/' + this.month + '/' + this.day
 }

BahaiDateV1.prototype.toValue = function()
 {
  return this.gDateTime.valueOf()
 }


BahaiDateV1.prototype.monthName = function(lang, variation)
 {
  return bDateNames[validateLang(lang,variation)][this.month]
 }

BahaiDateV1.prototype.dayName = function(lang, variation)
 {
  if(this.month!=0)
   {
    return bWeekdays[validateLang(lang,variation)][this.day]
   }
  else
   {
    return bAyyamiHa[validateLang(lang,variation)][this.day-1]
   }
 }

BahaiDateV1.prototype.toStringDateTime = function()
 {
  return this.year + '/' + this.month + '/' + this.day + ' ' + this.hours + ':' + this.minutes
 }

BahaiDateV1.prototype.toNames = function(lang, variation)
 {
  return this.dayName(lang, variation) + ' of ' + this.monthName(lang, variation) + ', ' + this.year + ' BE'
 }


// Misc date calculations needed

//----- Calculate sunset on a given date
Date.prototype.sunset = function(longitude, latitude)
// get exact sunset time
 {
  // calculate sunset


  // for now, simply assume 6:50pm
  this.setHours(18,50,0,0)
 }


//----- Normalize a date to be in the same timezone as the compareTime. This
//        eliminates daylight savings vs standard time differences
Date.prototype.normalize = function(compareTime)
 {
    // Return sunset time as if this date is in the same timezone as
    //   the compareTime date.

  if(!isNaN(compareTime))   // If no time given, don't bother normalizing
   {
    this.setMinutes(this.getMinutes() + compareTime.getTimezoneOffset() - this.getTimezoneOffset())
   }
 }


// define some constants for converting between milliseconds and days
var daysToMS = 24 * 60 * 60 * 1000
var msToDays = 1 / daysToMS


/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// Language specific settings here. Add lines for other languages!
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
// If a language or variation is added, be sure to update the function at the
//   bottom to validate the new language option. A list of language codes can
//   be found at: http://www.triacom.com/archive/iso639.en.html

var bDateNames = new Object
bDateNames['fa'+'noaccents']=['Ayyam-i-Ha','Baha','Jalal','Jamal','\'Azamat','Nur','Rahmat','Kalimat','Kamal','Asma\'','\'Izzat','Mashiyyat','\'Ilm','Qudrat','Qawl','Masa\'il','Sharaf','Sultan','Mulk','\'Ala']
bDateNames['fa'+'accents']=['Ayy&aacute;m-i-H&aacute;','Bah&aacute;','Jal&aacute;l','Jam&aacute;l','\'Azamat','N&uacute;r','Rahmat','Kalim&aacute;t','Kam&aacute;l','Asm&aacute;\'','\'Izzat','Ma<u>sh</u>&iacute;yyat','\'Ilm','Qudrat','Qawl','Mas&aacute;\'il','<u>Sh</u>araf','Sult&aacute;n','Mulk','\'Al&aacute;\'']
bDateNames['en']=['the Intercalary Days','Splendour','Glory','Beauty','Grandeur','Light','Mercy','Words','Perfection','Names','Might','Will','Knowledge','Power','Speech','Questions','Honour','Sovereignty','Dominion','Loftiness']

var bWeekdays = new Object
bWeekdays['fa'+'noaccents']=['Kamal','Fidal','\'Idal','Istijlal','Istiqlal','Jalal','Jamal','Kamal','Fidal','\'Idal','Istijlal','Istiqlal','Jalal','Jamal','Kamal','Fidal','\'Idal','Istijlal','Istiqlal','Jalal','\'Jamal']
bWeekdays['fa'+'accents']=['Kam&aacute;l','Fid&aacute;l','\'Id&aacute;l','Istijl&aacute;l','Istiql&aacute;l','Jal&aacute;l','Jam&aacute;l','Kam&aacute;l','Fid&aacute;l','\'Id&aacute;l','Istijl&aacute;l','Istiql&aacute;l','Jal&aacute;l','Jam&aacute;l','Kam&aacute;l','Fid&aacute;l','\'Id&aacute;l','Istijl&aacute;l','Istiql&aacute;l','Jal&aacute;l','Jam&aacute;l']
bWeekdays['en']=['Thursday','Friday','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Monday','Tuesday','Wednesday']

var bAyyamiHa = new Object
bAyyamiHa['fa'+'noaccents']=['1','2','3','4','5']
bAyyamiHa['fa'+'accents']=['1','2','3','4','5']
bAyyamiHa['en']=['First','Second','Third','Fourth','Fifth']

function validateLang(lang, variation)
 {
  // validate for each language
  switch (lang)
   {
    case 'en':  // no variations defined
      variation = ''
      break
    case 'fa':  // only two defined
      if(variation!='noaccents') variation = 'accents'
      break
    default:
        // none of the valid options given, default to Persian
      lang = 'fa'
      variation = 'accents'
   }

  return lang + variation
 }
 