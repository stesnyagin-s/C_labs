#include<stdio.h>
#include<stdlib.h>
#include<conio.h>
#define N 100
#define Tvalue int

struct Stack
{ int first;
 Tvalue body[N];
} S1,S2;

void Init(Stack &S)
{ S.first=0; }

int Empty(Stack S)
{return S.first==0;}

void Push(Stack &S, Tvalue V)
{ if(S.first==N) printf("STACK IS OVERFLOW");
   else S.body[S.first++]=V;
}

Tvalue Pop(Stack &S)
{ if(Empty(S)) printf("STACK IS EMPTY");
  else return S.body[--S.first];
}

Tvalue Top(Stack S)
{ if(Empty(S)) printf("STACK IS EMPTY");
  else return S.body[S.first-1];
}

int Size(Stack S){return S.first;}


void Display(Stack S)
{ printf("[ ");
for(int i=0;i<S.first;i++) printf("%d ",S.body[i]);
  printf("]\n");
}
/*
void Cat(Stack &S1, Stack &S2)
{ Stack S3; Tvalue V;
 Init(S3);
  while(!Empty(S2))
  { V=Pop(S2); Push(S3,V); }
  while(!Empty(S3))
  { V=Pop(S3); Push(S1,V); }
}
*/
void Cat(Stack &S1, Stack &S2)
{ Tvalue V;
  if(!Empty(S2))
  { V=Pop(S2); Cat(S1,S2); Push(S1,V);}
}

void Append(Stack &S1, Stack &S2)
{ Tvalue V;
  if(Empty(S1)) Cat(S1,S2);
  else { V=Pop(S1);
	 Append(S1,S2);
	 Push(S1,V);
       }
}

void QuickSort(Stack &S)
{ Stack S1,S2; Tvalue V, V1;
  if(!Empty(S))
  { Init(S1); Init(S2);
    V=Pop(S);
    while(!Empty(S))
    { V1=Pop(S);
      if(V1<V) Push(S1,V1);
       else Push(S2,V1);
    }
   QuickSort(S1);
   QuickSort(S2);
   Push(S2,V);
   Append(S1,S2);
   Cat(S,S1);
  }
}

void main()
{ clrscr();  randomize();
 Init(S1); Tvalue v;
 for(int i=0;i<10;i++){v=random(10); Push(S1,v);}
 Display(S1);
 Init(S2);
 for(i=0;i<7;i++){v=random(10); Push(S2,v);}
 Display(S2);
// Cat(S1,S2);
 Append(S1,S2);
 Display(S1);
 QuickSort(S1);
 Display(S1);
 getch();
}
