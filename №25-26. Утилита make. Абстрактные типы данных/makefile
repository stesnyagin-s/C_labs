CC = gcc
CFLAGS = -std=c99 -pedantic -Wall -g
OBJ = lab26.o udt.o
PROG = program

build: lab26.o udt.o
	$(CC) $(CFLAGS) -o $(PROG) $(OBJ)

lab26.o: lab26.cpp
	$(CC) $(CFLAGS) -c lab26.cpp

udt.o: udt.cpp
	$(CC) $(CFLAGS) -c udt.cpp

clean:
	rm $(PROG) $(OBJ)
