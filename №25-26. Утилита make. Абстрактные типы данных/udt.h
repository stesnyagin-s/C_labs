#include<stdio.h>
#include<stdlib.h>
#define N 100

struct Stack {

    int first;

    int body[N];

};

void Init(Stack &S);
int Empty(Stack S);
void Push(Stack &S, int V);
int Pop(Stack &S);
int Top(Stack S);
int Size(Stack S);
void Display(Stack S);
void Cat(Stack &S1, Stack &S2);
void Append(Stack &S1, Stack &S2);
void bubble_sort(Stack &S);

