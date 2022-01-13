/*

 Object structure

 Name,
 Long Text 1
 Long Text 2
 Long Text 3
 Long Text 4
 statusmax
 Value
 flags (0=Normal 1+flannel)

 */

/*
#define NOBS 194
#define OBMUL 8
#include <stdio.h>

long numobs=NOBS;

long objinfo[NOBS*4];


inventory()
{
    extern long mynum;
    bprintf("You are carrying\n");
    lobjsat(mynum);
}

*//*
Objinfo

Loc
Status
Stamina
Flag 1=carr 0=here
*//*

lobjsat(loc)
{
    aobjsat(loc,1);
}


aobjsat(loc,mode)  *//* Carried Loc ! *//*
{
    long a,b,c,d,e,f;
    char x[6],y[6];
    extern long debug_mode;
    b=0;
    c=0;
    d=0;
    e=0;
    f=0;
    while(c<NOBS)
    {
        if(((iscarrby(c,loc))&&(mode==1))||
            ((iscontin(c,loc))&&(mode==3)))
        {
            e=1;
            f+=1+strlen(c.name);
            if(debug_mode){ f+=5;sprintf(x,"%d",c);sprintf(y,"{%-3s}",x);}
            if(c.flags.isDestroyed) f+=2;
            if(iswornby(c,loc)) f+=strlen("<worn> ");
            if(f>79)
            {
                f=0;
                bprintf("\n");
            }
            if(c.flags.isDestroyed) bprintf("(");
            bprintf("%s",c.name);
            if(debug_mode) bprintf(y);
            if(iswornby(c,loc)) bprintf(" <worn>");
            if(c.flags.isDestroyed) bprintf(")");
            bprintf(" ");
            f++;
        }
        d+=4;
        c++;
    }
    if(!e)bprintf("Nothing");
    bprintf("\n");
}


iscontin(o1,o2)
{
    extern long my_lev;
    if(o1.carryFlag != IS_CONTAINED_IN) return(0)
        ;
    if(o1.locationId !=o2) return(0);
    if((my_lev<10) && o1.flags.isDestroyed)return(0);
    return(1);
}

fobnsys(nam,ctrl,ct_inf)
char *nam;
long ctrl,ct_inf;
{
    extern char wd_it[];
    extern long mynum;
    long a;
    long l1[32],l2[32];
    extern char wordbuf[];
    strcpy(l1,nam);lowercase(l1);
    a=0;
    if(!strcmp(l1,"red")) {brkword();return(4);}
    if(!strcmp(l1,"blue")) {brkword();return(5);}
    if(!strcmp(l1,"green")) {brkword();return(6);}
    while(a<NOBS)
    {
        strcpy(l2,a.name);lowercase(l2);
        if(!strcmp(l1,l2))
        {
            strcpy(wd_it,nam);
            switch(ctrl)
            {
                case 0:
                    return(a);
                case 1:*//* Patch for shields *//*
                    if((a==112)&&(iscarrby(113,mynum))) return(113);
                    if((a==112)&&(iscarrby(114,mynum))) return(114);
                    if(a.isAvailable()) return(a);
                    break;
                case 2:
                    if(iscarrby(a,mynum)) return(a);
                    break;
                case 3:
                    if(iscarrby(a,ct_inf)) return(a);
                    break
                        ;
                case 4:
                    if(ishere(a)) return(a);
                    break;
                case 5:
                    if(iscontin(a,ct_inf)) return(a);
                    break;
                default:
                    return(a);
            }
        }
        a++;
    }
    return(-1);
}

fobn(word)
char *word;
{
    long x;
    x=fobna(word);
    if(x!=-1) return(x);
    return(fobnsys(word,0,0));
}

fobna(word)
char *word;
{
    return(fobnsys(word,1,0));
}

fobnin(word,ct)
char *word;
long ct;
{
    return(fobnsys(word,5,ct));
}

fobnc(word)
char *word;
{
    return(fobnsys(word,2,0));
}

fobncb(word,by)
char *word;
{
    return(fobnsys(word,3,by));
}

fobnh(word)
char *word;
{
    return(fobnsys(word,4,0));
}

getobj()
{
    extern long mynum;
    extern char globme[];
    extern long curch;
    extern char wordbuf[];
    long a,b;
    long i;
    long des_inf= -1;
    extern long stp;
    char bf[256];
    if(brkword()==-1)
    {
        bprintf("Get what ?\n");
        return;
    }
    a=fobnh(wordbuf);
    *//* Hold *//*
    i=stp;
    strcpy(bf,wordbuf);
    if((brkword()!=-1)&&((strcmp(wordbuf,"from")==0)||(strcmp(wordbuf,"out")==0)))
    {
        if(brkword()==-1)
        {
            bprintf("From what ?\n");
            return;
        }
        des_inf=fobna(wordbuf);
        if(des_inf==-1)
        {
            bprintf("You can't take things from that - it's not here\n");
            return;
        }
        a=fobnin(bf,des_inf);
    }
    stp=i;
    if(a==-1)
    {
        bprintf("That is not here.\n");
        return;
    }
    if((a==112)&&(des_inf==-1))
    {
        if(getItem(113).flags.isDestroyed) a=113;
        else if(getItem(114).flags.isDestroyed) a=114;
        if((a==113)||(a==114)) a.flags.isDestroyed = false;
        else bprintf("The shields are all to firmly secured to the walls\n");
    }
    if(a.flannel)
    {
        bprintf("You can't take that!\n");
        return;
    }
    if(dragget()) return;
    if(!cancarry(mynum))
    {
        bprintf("You can't carry any more\n");
        return;
    }
    if((a==32)&&(state(a)==1)&&(await user.player.getHelper() === null))
    {
        bprintf("Its too well embedded to shift alone.\n");
        return;
    }
    a.setLocation(user.playerId, IS_CARRIED_BY);
    sprintf(bf,light(user.name, ' takes the %s\n'),a.name);
    bprintf("Ok...\n");
                await sendGlobalMessage(
                    user.name,
                    user.locationId,
                    bf,
                );
    if(a.flags.changeStateOnPut) setstate(a,0);
    if(curch==-1081)
    {
        setstate(20,1);
        bprintf("The door clicks shut....\n");
    }
}

ishere(item)
{
    extern long curch;
    long a;
    extern long my_lev;
    if((my_lev<10) && item.flags.isDestroyed)return(0);
    if(item.carryFlag === IS_CARRIED_BY) return(0);
    if(item.locationId!=curch) return(0);
    return(1);
}

iscarrby(item,user)
{
    extern long curch;
    extern long my_lev;
    if((my_lev<10) && item.flags.isDestroyed) return(0);
    if((item.carryFlag !== IS_CARRIED_BY) && (item.carryFlag !== IS_WEARING_BY)) return(0);
    if(item.locationId!=user) return(0);
    return(1);
}

dropitem()
{
    extern long mynum,curch;
    extern char wordbuf[],globme[];
    long a,b,bf[32];
    extern long my_lev;
    if(brkword()==-1)
    {
        bprintf("Drop what ?\n");
        return;
    }
    a=fobnc(wordbuf);
    if(a==-1)
    {
        bprintf("You are not carrying that.\n");
        return;
    }

    if((my_lev<10)&&(a==32))
    {
        bprintf("You can't let go of it!\n");
        return;
    }
    a.setLocation(user.locationId, IS_LOCATED_AT);
    bprintf("OK..\n");
    sprintf(bf,light(user.name, ' drops the %s.\n\n'),wordbuf);
                await sendGlobalMessage(
                    user.name,
                    user.locationId,
                    bf,
                );
    if((curch!=-183)&&(curch!=-5))return;
    sprintf(bf,"The %s disappears into the bottomless pit.\n",wordbuf);
    bprintf("It disappears down into the bottomless pit.....\n");
                await sendGlobalMessage(
                    user.name,
                    user.locationId,
                    bf,
                );
    user.data.score += (tscale() * a.value) / 5;
    calibme();
    a.setLocation(-6, IS_LOCATED_AT);
}
lisobs()
{
    lojal2(1);
    showwthr();
    lojal2(0);
}

lojal2(n)
{
    extern char wd_it[];
    long a;
    a=0;
    while(a<NOBS)
    {
        if((ishere(a))&&(a.flannel === n))
        {
            if(state(a)>3) continue;
            if(!!strlen(olongt(a,state(a)))) *//*OLONGT NOTE TO BE ADDED *//*
            {
                if(a.flags.isDestroyed) bprintf("--");

                oplong(a);
                strcpy(wd_it,a.name);
            }
        }
        a++;
    }
}
dumpitems()
{
    extern long mynum;
    extern long curch;
    dumpstuff(mynum,curch);
}

dumpstuff(n,loc)
{
    long b;
    b=0;
    while(b<NOBS)
    {
        if(iscarrby(b,n))

        {
            a.setLocation(loc, IS_LOCATED_AT);
        }
        b++;
    }
}

long ublock[16*49];


whocom()
{
    long a;
    extern long my_lev;
    long bas;
    a=0;
    bas=16;
    if(my_lev>9)
    {
        bprintf("Players\n");
        bas=48;
    }
    while(a<bas)
    {
        if(a==16)bprintf("----------\nMobiles\n");
        if(!strlen(pname(a))) goto npas;
        dispuser(a);
        npas:a++;
    }
    bprintf("\n");
}

dispuser(ubase)
{
    extern long my_lev;
    if(ubase.isDead()) return; *//* On  Non game mode *//*
    if(ubase.visibility > user.data.level) return;
    if(ubase.visibility) bprintf("(");
    bprintf("%s ",pname(ubase));
    disl4(ubase.level, ubase.flags.gender);
    if(ubase.visibility) bprintf(")");
    if(ubase.isDisabled()) bprintf(" [Absent From Reality]");
    bprintf("\n");
}

disle3(n,s)
{
    disl4(n,s);
    bprintf("\n");
}
disl4(n,s)
{
    extern long hasfarted;
    switch(n)
    {
        case 1:
            bprintf("The Novice");
            break;
        case 2:
            if(!s)bprintf("The Adventurer");
            else
                bprintf("The Adventuress");
            break;
        case 3:
            bprintf("The Hero");
            if(s)bprintf("ine");
            break;
        case 4:
            bprintf("The Champion");
            break;
        case 5:
            if(!s)bprintf("The Conjurer");
            else
                bprintf("The Conjuress");
            break;
        case 6:
            bprintf("The Magician");
            break;
        case 7:
            if(s)bprintf("The Enchantress");
            else
                bprintf("The Enchanter");
            break;
        case 8:
            if(s)bprintf("The Sorceress");
            else
                bprintf("The Sorceror");
            break;
        case 9:bprintf("The Warlock");
            break;
        case 10:
            if(s)bprintf("The Apprentice Witch");
            else
                bprintf("The Apprentice Wizard");
            break;
        case 11:bprintf("The 370");
            break;
        case 12:bprintf("The Hilbert-Space");
            break;
        case 14:bprintf("The Completely Normal Naughty Spud");
            break;
        case 15:bprintf("The Wimbledon Weirdo");
            break;
        case 16:bprintf("The DangerMouse");
            break;
        case 17:bprintf("The Charred Wi");
            if(s) bprintf("tch");
            else bprintf("zard");
            break;
        case 18:bprintf("The Cuddly Toy");
            break;
        case 19:if(!hasfarted) bprintf("Of The Opera");
        else bprintf("Raspberry Blower Of Old London Town");
            break;
        case 20:bprintf("The 50Hz E.R.C.S");
            break;
        case 21:bprintf("who couldn't decide what to call himself");
            break;
        case 22:bprintf("The Summoner");
            break;
        case 10000:
            bprintf("The 159 IQ Mega-Creator");
            break;
        case 10033:
        case 10001:bprintf("The Arch-Wi");
            if(s)bprintf("tch");
            else bprintf("zard");
            break;
        case 10002:bprintf("The Wet Kipper");
            break;
        case 10003:bprintf("The Thingummy");
            break;
        case 68000:
            bprintf("The Wanderer");
            break;
        case -2:
            bprintf("\010");
            break;
        case -11:bprintf("The Broke Dwarf");break;
        case -12:bprintf("The Radioactive Dwarf");break;
        case -10:bprintf("The Heavy-Fan Dwarf");break;
        case -13:bprintf("The Upper Class Dwarven Smith");break;
        case -14:bprintf("The Singing Dwarf");break;
        case -30:bprintf("The Sorceror");break;
        case -31:bprintf("the Acolyte");break;
        default:
            bprintf("The Cardboard Box");
            break;
    }
}
*/



/*
lispeople()
{
    extern long debug_mode;
    extern long curch;
    extern long mynum;
    extern char wd_him[],wd_her[];
    long a,b;
    b=0;
    a=0;
    while(a<48)
    {
        if(a==mynum)
        {
            a++;
            continue;
        }
        if((!!strlen(pname(a)))&&(a.locationId === user.locationId)&&(await canSeePlayer(g.user, a, ail_blind)))
        {
            await setname(a);
            b=1;
            bprintf("%s ",pname(a));
            if(debug_mode) bprintf("{%d}",a);
            disl4(a.level, a.flags.gender);
            if(a.flags.gender) strcpy(wd_her,pname(a));
            else strcpy(wd_him,pname(a));
            bprintf(" is here carrying\n");
            lobjsat(a);
        }
        a++;
    }
}

usercom()
{
    extern long my_lev;
    long a;
    a=my_lev;
    my_lev=0;
    whocom();
    my_lev=a;
}

oplong(x)
{
    extern long debug_mode;
    if(debug_mode)
    {
        bprintf("{%d} %s\n",x.itemId,x.description);
        return;
    }
    if(strlen(x.description))
        bprintf("%s\n",x.description);
}

*/