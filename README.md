# Sprendžiamo uždavinio aprašymas

## 1. Sistemos paskirtis

Projekto tikslas – palengvinti kompiuterių atnaujinimo (angl. refurbishment) ir perpardavimo verslo valdymą bei pagerinti priimamų sprendimų efektyvumą, sekant ir analizuojant įrenginių pirkimo, remonto ir pardavimo duomenis.  

Ši sistema leis verslo savininkui ir darbuotojams centralizuotai registruoti nupirktus naudotus kompiuterius, fiksuoti atliktus remontus, stebėti kiekvieno įrenginio kaštus ir pardavimo kainą bei automatiškai apskaičiuoti pelną. Tokiu būdu bus lengviau įvertinti, kurie sandoriai buvo pelningiausi, kiek laiko ir resursų pareikalavo konkretus įrenginys, bei priimti duomenimis grįstus sprendimus dėl būsimų pirkimų ar kainodaros.  

Veikimo principas – kuriamą platformą sudaro dvi dalys:  
- internetinė aplikacija (tinklalapis), kuria naudosis įmonės darbuotojai (remontuotojas ir administratorius) bei vieši svetainės lankytojai;  
- aplikacijų programavimo sąsaja (API).  

Remontuotojas, prisiregistravęs prie internetinės aplikacijos, galės:  
- įvesti naujus kompiuterių įrašus (modelis, pirkimo kaina, būsena ir kt.);  
- pridėti atliktų remontų įrašus (aprašymas, kaina, sugaištas laikas);  
- pažymėti kompiuterį kaip paruoštą parduoti.  

Administratorius tvirtina naujų naudotojų registracijas bei taisytojų paruoštus pardavimo įrašus prieš jiems tampant matomiems viešai. Taip pat jis valdo sistemą – tvarko kompiuterių modelių sąrašą ir gali koreguoti ar pašalinti neteisingus duomenis.  

Viešas svetainės lankytojas (svečias) gali:  
- peržiūrėti parduodamų kompiuterių sąrašą, aprašymus ir nuotraukas;  
- prisiregistruoti kaip remontuotojas su administratoriaus leidimu (unikaliu kodu).  

---

## 2. Funkciniai reikalavimai

### Neregistruotas naudotojas galės
1. Peržiūrėti platformos pagrindinį puslapį.  
2. Peržiūrėti pardavime esančių (administratoriaus patvirtintų) kompiuterių sąrašą.  
3. Peržiūrėti pasirinkto parduodamo kompiuterio detalų aprašymą (nuotraukos, specifikacijos, būklė, kaina ir kt.).  
4. Prisijungti prie sistemos arba užsiregistruoti naują remontuotojo paskyrą (su administratoriaus kodu).  

### Registruotas naudotojas galės
1. Atsijungti nuo internetinės aplikacijos.  
2. Keisti savo paskyros duomenis (vardas, pavardė, el. paštas ir kt.).  
3. Tvarkyti jam priskirtus kompiuterius:  
   - peržiūrėti atliktų remontų sąrašą;  
   - pridėti remontą (kaina, praleistas laikas, aprašymas);  
   - pateikti remontų baigimą administratoriui.  
4. Keisti kompiuterio nuotraukas.  

### Administratorius galės
1. Patvirtinti naujai užsiregistravusio naudotojo (remontuotojo) registraciją.  
2. Patvirtinti taisytojo paskelbtą kompiuterio pardavimo įrašą.  
3. Keisti kompiuterio būsenas (įskaitant viešą paskelbimą).  
4. Tvarkyti gamintojų ir modelių sąrašą.  
5. Pašalinti naudotojus (pvz., atleistą darbuotoją) arba pakeisti jų rolę.  
6. Pašalinti netinkamus ar klaidingus įrašus (kompiuterių, remontų ar nuotraukų).  
7. Peržiūrėti bendras ataskaitas ir statistiką (pelnas, geriausiai parduodami modeliai, pelno marža, pardavimo greitis ir kt.).  

---

## 3. Sistemos sudedamosios dalys

- **Front-End:** React.js  
- **Back-End:** Node.js su Express  
- **Duomenų bazė:** PostgreSQL  
