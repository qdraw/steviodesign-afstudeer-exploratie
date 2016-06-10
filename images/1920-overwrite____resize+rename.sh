#!/bin/bash

FILES=$(ls -1)

for FILE in $FILES
do
    EXT=$(echo $FILE | awk -F . '{print $NF}')
    if [[ $EXT =~ [A-Z]{1,} ]]
    then
        BASE=${FILE%\.*}
        NEWEXT=$(echo $EXT | tr '[:upper:]' '[:lower:]')
        if [ ! -e $BASE.$NEWEXT ]
        then
            mv $FILE $BASE.$NEWEXT
        else
            mv $FILE $BASE.$NEWEXT

            echo "Could not rename $FILE to $BASE.$NEWEXT: $BASE.$NEWEXT already exists! > still overwriting"
        fi
    fi
    
    
done


for i in `ls -1 *jpg`; do convert -resize 1920x1920 $i "$i"i; done

## for file in *.jpg_i; do echo $(basename $file .jpg)_kl.jpg; done


for i in *.jpgi; 
do mv $i `basename $i .jpgi`.jpg; 
done


exit 0


