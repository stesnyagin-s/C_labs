#! /usr/bin/env bash

if [ $1 == "-C" ]
 then
source lab21.conf
else 
prefix=$1
rangeMin=$2
rangeMax=$3
directory=$4
fi

echo "Ïğåôèêñ: $prefix"
echo "Äèàïîçîí: $rangeMin-$rangeMax" áèò
echo "Äèğåêòîğèÿ: $directory"

print_help()
{
echo "Ñèíòàêñèñ: lab21_var14.sh [-C] / [Ïğåôèêñ] [Ìèíèìàëüíûé ğàçìåğ ôàéëà] [Ìàêñèìàëüíûé ğàçìåğ ôàéëà] [Äèğåêòîğèÿ]"
echo "Ïğèìåğ: lab21_var14.sh old 1024 2048 /home/user/"
echo "Ïğèìåğ: lab21_var14.sh -C"
}

if  [[ "$prefix" = '' ]] || [[ "$rangeMin" -eq '' ]] || [[ "$rangeMax" -eq '' ]] || [[ "$directory" = '' ]] 
 then
 echo "Îøèáêà. Ïğîïóùåíû íåêîòîğûå ïàğàìåòğû."
 print_help
 exit 1
fi


if ! [[ $rangeMin =~ ^-?[0-9]+$ ]] || ! [[ $rangeMax =~ ^-?[0-9]+$ ]] || [[ $rangeMin -lt 0 ]] || [[ $rangeMax -lt 0 ]] ;  then
   echo "Îøèáêà. Ğàçìåğû ôàéëîâ äîëæíû áûòü öåëûìè ÷èñëàìè >= 0" >&2; 
   print_help
   exit 1
fi

if   [[ "$rangeMin" -gt "$rangeMax" ]]
 then
 echo "Ìèíèìàëüíûé ğàçìåğ ôàéëà äîëæåí áûòü ğàâåí èëè áûòü ìåíüøå ìàêñèìàëüíîãî."
 print_help
 exit 1
fi


files=$(ls -l $directory | grep -v '^d' | awk -v min=$rangeMin -v max=$rangeMax '{ if ( $5 >= 'min' && $5 <= 'max' ) print $9 }' | grep "^$prefix")
if [ "$files" == "" ] 
then echo "Ôàéëû, ñîîòâåòñòâóşùèå çàäàííûì ïàğàìåòğàì, íå íàéäåíû"
else 
echo "$files" | while read name; do rm "$directory$name"; echo "$directory$name - óäàë¸í";    done
fi