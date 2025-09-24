# Refurb-My-Mac

1.1.	Sistemos paskirtis
Projekto tikslas – palengvinti kompiuterių atnaujinimo (angl. refurbishment) ir perpardavimo verslo valdymą bei pagerinti priimamų sprendimų efektyvumą, sekant ir analizuojant įrenginių pirkimo, remonto ir pardavimo duomenis. 
Ši sistema leis verslo savininkui ir darbuotojams centralizuotai registruoti nupirktus naudotus kompiuterius, fiksuoti atliktus remontus, stebėti kiekvieno įrenginio kaštus ir pardavimo kainą bei automatiškai apskaičiuoti pelną. Tokiu būdu bus lengviau įvertinti, kurie sandoriai buvo pelningiausi, kiek laiko ir resursų pareikalavo konkretus įrenginys, bei priimti duomenimis grįstus sprendimus dėl būsimų pirkimų ar kainodaros.
Veikimo principas – kuriamą platformą sudaro dvi dalys: internetinė aplikacija (tinklalapis), kuria naudosis įmonės darbuotojai (remontuotojas ir administratorius) bei vieši svetainės lankytojai, ir aplikacijų programavimo sąsaja (API). 
Remontuotojas, prisiregistravęs prie internetinės aplikacijos, galės įvesti naujus kompiuterių įrašus, nurodyti jų modelį, pirkimo kainą, būseną ir kitą pradinę informaciją, taip pat pridėti atliktų remontų įrašus (kiekvienam remontui nurodant aprašymą, kainą ir sugaištą laiką). Baigus paruošti kompiuterį pardavimui, remontuotojas galės pažymėti jį kaip paruoštą parduoti (paskelbti įrašą). Administratorius tvirtina naujų naudotojų registracijas bei taisytojų paruoštus kompiuterių pardavimo įrašus prieš jiems tampant matomiems viešai. Taip pat administratorius valdo sistemą – tvarko kompiuterių modelių sąrašą, prireikus gali koreguoti ar pašalinti neteisingus duomenis. Viešas svetainės lankytojas (svečias) gali peržiūrėti paskelbtų parduodamų kompiuterių sąrašą, jų aprašymus ir nuotraukas, gali prisiregistruoti kaip remontuotojas su administratoriaus leidimu (unikaliu kodu).
1.2.	Funkciniai reikalavimai
Neregistruotas sistemos naudotojas galės:
1.	Peržiūrėti platformos pagrindinį puslapį;
2.	Peržiūrėti pardavime esančių (administratoriaus patvirtintų) kompiuterių sąrašą;
3.	Peržiūrėti pasirinkto parduodamo kompiuterio detalų aprašymą, įskaitant nuotraukas, technines specifikacijas, būklės informaciją, kainą ir kt.;
4.	Prisijungti prie sistemos arba užsiregistruoti naują remontuotojo paskyrą (su unikaliu administratoriaus duotu kodu). 

Registruotas sistemos naudotojas galės:
1.	Atsijungti nuo internetinės aplikacijos.
2.	Keisti savo paskyros duomenis (vardas, pavardė, paštas ir pan.)
3.	Tvarkyti remontuojamus (jam priskirtus) kompiuterius:
•	Peržiūrėti atliktų remontų sąrašą
•	Pridėti remontą ir informaciją apie jį (remonto kainą, praleistas valandas, aprašymą ir pan.)
•	Pateikti kompiuterio remontų baigimą administratoriui
4.	Keisti kompiuterio nuotraukas

Administratorius galės:
1.	Patvirtinti naujai užsiregistravusio naudotojo (remontuotojo) registraciją, suteikdamas jam prieigą prie sistemos
2.	Patvirtinti taisytojo paskelbtą kompiuterio pardavimo įrašą prieš jam tampant viešu. 
3.	Keisti kompiuterio būsenas (įskaitant kompiuterio viešą paskelbimą interneto svetainėje).
4.	Pridėti naujus kompiuterių gamintojus ir modelius į sistemos duomenų bazę, arba redaguoti esamų modelių informaciją. 
5.	Pašalinti naudotojus (pvz., atleisto darbuotojo paskyrą) arba pakeisti jų rolę.

6.	Pašalinti netinkamus ar klaidingus kompiuterių įrašus, remontų įrašus ar nuotraukas, jei pastebimi netikslumai.
7.	Peržiūrėti bendrus verslo ataskaitų rodiklius ir statistiką: bendrą pelną per pasirinktą laikotarpį (pvz., mėnesio), geriausiai parduodamus modelius, didžiausią pelno maržą, greičiausiai parduotus kompiuterius (mažiausias dienų skaičius nuo įsigijimo iki pardavimo) ir pan

2. Sprendžiamo uždavinio aprašymas
Sistemos sudedamosios dalys:
	•	Kliento pusė (angl. Front-End) naudojant React.js;
	•	Serverio pusė (angl. Back-End) naudojant Node.js su Express karkasu;
	•	Duomenų bazė PostgreSQL.
