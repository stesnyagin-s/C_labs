#include<stdio.h>
#include<stdlib.h>
#include<conio.h>
#include"stack2.h"

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
{ clrscr();  randomize(); Stack S1, S2;
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
