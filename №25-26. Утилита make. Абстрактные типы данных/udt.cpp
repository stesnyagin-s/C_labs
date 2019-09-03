#include "udt.h"

void Init(Stack &S) { S.first = 0; }

int Empty(Stack S) { return S.first == 0; }

void Push(Stack &S, int V) {
    if (S.first == N) printf("STACK IS OVERFLOW");
    else S.body[S.first++] = V;
}

int Pop(Stack &S) {
    if (Empty(S)) printf("STACK IS EMPTY");
    else return S.body[--S.first];
}

int Top(Stack S) {
    if (Empty(S)) printf("STACK IS EMPTY");
    else return S.body[S.first - 1];
}

int Size(Stack S) { return S.first; }

void Display(Stack S) {
    printf("[ ");
    for (int i = 0; i < S.first; i++) printf("%d ", S.body[i]);
    printf("]\n");
}

void Cat(Stack &S1, Stack &S2) {
    int V;
    if (!Empty(S2)) {
        V = Pop(S2);
        Cat(S1, S2);
        Push(S1, V);
    }
}

void Append(Stack &S1, Stack &S2) {
    int V;
    if (Empty(S1)) Cat(S1, S2);
    else {
        V = Pop(S1);
        Append(S1, S2);
        Push(S1, V);
    }
}

void bubble_sort(Stack &S)
{
    for (int i = 0; i < S.first-1; i++) {
        bool swapped = false;
        for (int j = 0; j < S.first-i-1; j++) {
            if (S.body[j] > S.body[j+1]) {
                int b = S.body[j];
                S.body[j] = S.body[j+1];
                S.body[j+1] = b;
                swapped = true;
            }
        }

        if(!swapped)
            break;
    }
}