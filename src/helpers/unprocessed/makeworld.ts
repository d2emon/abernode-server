import {
    writeData,
} from '../blib';
/*
#include <stdio.h>
#include <string.h>

*//*
        World Creator
*//*


void main()
{
    FILE *a;
    long x[64];
    long b;
    memset(x,0,64*sizeof(long));
    a=fopen("/usr/tmp/-iy7AM","w");
    x[0]=1;
    x[1]=1;
    await writeData(a,x,0,64);
    b=0;
    while(b<600)
    {
        await writeData(a,x,b,64);
        x[0]=0;
        b++;
    }
    fclose(a);
}

*/
