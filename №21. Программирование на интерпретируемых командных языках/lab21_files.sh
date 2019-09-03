#! /usr/bin/env bash

mkdir lab21_test

for i in `seq 1 5`;
        do
             echo "Some text" | cat > ./lab21_test/one_$i
             echo "Some bigger text" | cat > ./lab21_test/two_$i
        done    
for i in `seq 6 10`;
        do
             echo "Some text" | cat > ./lab21_test/two_$i
             echo "Some bigger text" | cat > ./lab21_test/one_$i
        done    
                
