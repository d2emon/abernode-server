/*
extern FILE *openuaf();
extern FILE *openroom();
extern char wordbuf[];
*/

/*

The next part of the universe...


*/

/*

Weather Routines

Current weather defined by state of object 47

states are

0   Sunny
1   Rain
2   Stormy
3   Snowing

*/

/*
setwthr(n)
{
    extern long my_lev;
    if(my_lev<10)
    {
        bprintf("What ?\n");
        return;
    }
    adjwthr(n);
}

suncom()
{
    setwthr(0);
}

raincom()
{
    setwthr(1);
}

stormcom()
{
    setwthr(2);
}

snowcom()
{
    setwthr(3);
}

blizzardcom()
{
    setwthr(4);
}
adjwthr(n)
{
    long x;
    extern char globme[];
    extern long curch;
    x=state(0);
    setstate(0,n);
    if(x!=n) sendsys(globme,globme,-10030,n,"");
}

longwthr()
{
    long a;
    a = randomizer();
    if(a<50)
    {
        adjwthr(1);
        return;
    }
    if(a>90)
    {
        adjwthr(2);
        return;
    }
    adjwthr(0);
    return;
}


wthrrcv(type)
{
    if(!outdoors()) return;
    type=modifwthr(type);
    switch(type)
    {
        case 0:
            bprintf(light("The sun comes out of the clouds\n"));
            break;
        case 1:
            bprintf(light("It has started to rain\n"));
            break;
        case 2:
            break;
        case 3:
            bprintf(light("It has started to snow\n"));
            break;
        case 4:
            bprintf(light("You are half blinded by drifting snow, as a white, icy blizzard sweeps across\nthe land\n"));
            break;
    }
}

showwthr()
{
    extern long curch;
    if(!outdoors()) return;
    switch(modifwthr(state(0)))
    {
        case 1:
            if((curch>-199)&&(curch<-178))
            {
                bprintf("It is raining, a gentle mist of rain, which sticks to everything around\n");
                bprintf("you making it glisten and shine. High in the skies above you is a rainbow\n");
            }
            else
                bprintf(light("It is raining\n"));
            break;
        case 2:
            bprintf(light("The skies are dark and stormy\n"));
            break;
        case 3:
            bprintf(light("It is snowing") + "\n");
            break;
        case 4:
            bprintf(light("A blizzard is howling around you") +"\n");
            break;
    }
}

outdoors()
{
    extern long curch;
    switch(curch)
    {
        case -100:;
        case -101:;
        case -102:return(1);
        case -183:return(0);
        case -170:return(0);
        default:
            if((curch>-191)&&(curch<-168)) return(1);
            if((curch>-172)&&(curch<-181)) return(1);
            return(0);
    }
}


*//* Silly Section *//*

sillycom(txt)
char *txt;
{
    extern char globme[];
    extern long curch;
    char bk[256];
    sprintf(bk,txt,globme,globme);
    await sendGlobalMessage(
        user.name,
        user.locationId,
        bk,
    )
}

laughcom()
{
    if(chkdumb()) return;
    sillycom(sound(%s, ' falls over laughing\n'));
    bprintf("You start to laugh\n");
}

purrcom()
{
    if(chkdumb()) return;
    sillycom(sound(%s, ' starts purring\n'));
    bprintf("MMMMEMEEEEEEEOOOOOOOWWWWWWW!!\n");
}

crycom()
{
    if(chkdumb()) return;
    sillycom(visual(%s, "%s bursts into tears\n"));
    bprintf("You burst into tears\n");
}

sulkcom()
{
    sillycom(visual(%s, "%s sulks\n"));
    bprintf("You sulk....\n");
}

burpcom()
{
    if(chkdumb()) return;
    sillycom(sound(%s, ' burps loudly\n'));
    bprintf("You burp rudely\n");
}

hiccupcom()
{
    if(chkdumb()) return;
    sillycom(sound(%s, ' hiccups\n'));
    bprintf("You hiccup\n");
}

long hasfarted=0;

fartcom()
{
    extern long hasfarted;
    hasfarted=1;
    sillycom(sound(%s, ' lets off a real rip roarer\n'));
    bprintf("Fine...\n");
}

grincom()
{
    sillycom(visual(%s, "%s grins evilly\n"));
    bprintf("You grin evilly\n");
}

smilecom()
{
    sillycom(visual(%s, "%s smiles happily\n"));
    bprintf("You smile happily\n");
}

winkcom()
{					*//* At person later maybe ? *//*
    sillycom(visual(%s, "%s winks suggestively\n"));
    bprintf("You wink\n");
}

sniggercom()
{
    if(chkdumb()) return;
    sillycom(sound(%s, ' sniggers\n'));
    bprintf("You snigger\n");
}

posecom()
{
    long a;
    extern long my_lev;
    if(my_lev<10)
    {
        bprintf("You are just not up to this yet\n");
        return;
    }
    time(&a);
    srand(a);
    a = randomizer();
    a=a%5;
    bprintf("POSE :%d\n",a);
    switch(a)
    {
        case 0:
            break;
        case 1:
            sillycom(visual(%s, "%s throws out one arm and sends a huge bolt of fire high\n\
into the sky\n"));
            broad(light("A massive ball of fire explodes high up in the sky\n"));
            result.newEvents = true;
            break;
        case 2:
            sillycom(visual(%s, "%s turns casually into a hamster before resuming normal shape\n"));
            break;
        case 3:
            sillycom(visual(%s, "%s \
starts sizzling with magical energy\n"));
            break;
        case 4:
            sillycom(visual(%s, "%s begins to crackle with magical fire\n"));
            break;
    }
}

emotecom()
*//*
 (C) Jim Finnis
*//*
{
    extern long my_lev;
    char buf[100];
    const buf6 = getreinput();
    if (my_lev<10000)
        bprintf("Your emotions are strictly limited!\n");
    else
        sillycom(sound('%s', ` ${buf6}\n`));
}

praycom()
{
    extern long curch;
    sillycom(visual(%s, "%s falls down and grovels in the dirt\n"));
    bprintf("Ok\n");
}

yawncom()
{
    sillycom(sound(%s, ' yawns\n'));
}

groancom()
{
    sillycom(sound(%s, ' groans loudly\n'));
    bprintf("You groan\n");
}

moancom()
{
    sillycom(sound(%s, ' starts making moaning noises\n'));
    bprintf("You start to moan\n");
}

cancarry(plyr)
{
    extern long numobs;
    long a,b;
    a=0;
    b=0;
    if(plyr.isAdmin()) return(1);
    if(plyr.level < 0) return(1);
    while(a<numobs)
    {
        if((iscarrby(a,plyr))&&(!a.flags.isDestroyed)) b++;
        a++;
    }
    if(b < (plyr.level + 5)) return(1);
    return(0);
}


setcom()
{
    long a,b,c;
    extern long my_lev;
    extern char wordbuf[];
    if(brkword()== -1)
    {
        bprintf("set what\n");
        return;
    }
    if(my_lev<10)
    {
        bprintf("Sorry, wizards only\n");
        return;
    }
    a=fobna(wordbuf);
    if(a== -1)
    {
        goto setmobile;
    }
    if(brkword()== -1)
    {
        bprintf("Set to what value ?\n");
        return;
    }
    if(strcmp(wordbuf,"bit")==0) goto bitset;
    if(strcmp(wordbuf,"byte")==0) goto byteset;
    b=numarg(wordbuf);
    if(b>a.maxState)
    {
        bprintf("Sorry max state for that is %d\n",a.maxState);
        return;
    }
    if(b<0)
    {
        bprintf("States start at 0\n");
        return;
    }
    setstate(a,b);
    return;
    bitset:if(brkword()==-1)
    {
        bprintf("Which bit ?\n");
        return;
    }
    b=numarg(wordbuf);
    if(brkword()==-1)
    {
        bprintf("The bit is %s\n",a.flags[b] ? "TRUE" : "FALSE");
        return;
    }
    c=numarg(wordbuf);
    if((c<0)||(c>1)||(b<0)||(b>15))
    {
        bprintf("Number out of range\n");
        return;
    }
    a.flags[b] = c;
    return;
    byteset:if(brkword()==-1)
    {
        bprintf("Which byte ?\n");
        return;
    }
    b=numarg(wordbuf);
    if(brkword()==-1)
    {
        bprintf("Current Value is : %d\n",a.flags.values[b]);
        return;
    }
    c=numarg(wordbuf);
    if((b<0)||(b>1)||(c<0)||(c>255))
    {
        bprintf("Number out of range\n");
        return;
    }
    a.flags.values[b] = c;
    return;
    setmobile:a = await world.findVisiblePlayerByName(wordbuf, user, user.isBlind);
    if(a==-1)
    {
        bprintf("Set what ?\n");
        return;
    }
    if(a<16)
    {
        bprintf("Mobiles only\n");
        return;
    }
    if(brkword()==-1)
    {
        bprintf("To what value ?\n");
        return;
    }
    b=numarg(wordbuf);
    a.strength = b;
}
*/

import Item, {ITEM_IS_LIGHT} from "../../models/item";
import World from "./opensys";
import { User } from "./dummy";
import {Player} from "../../models/player";

export const hasLight = async (locationId: number, world?: World): Promise<boolean> => {
    // FIXME
    const w = world || await World.load();

    for (let itemId = 0; itemId < numobs; itemId += 1) {
        const item: Item = await w.getItem(itemId);

        if ((item.itemId !== 32) && !item.flags.isLit) {
            continue;
        }

        if (ishere(item.itemId)) {
            return true;
        }

        if ([0, 3].indexOf(item.carryFlag) < 0) {
            const p = await w.getPlayer(item.locationId);
            if (p.locationId === locationId) {
                return true;
            }
        }
    }
    return false;
}

export const isDark = (locationId: number): boolean => {
    // Location: Check always not dark
    if ([-1100, -1101].indexOf(locationId) >= 0) {
        return false;
    }
    // Location: Check unknown locations
    if ((locationId <= -1113) && (locationId >= -1123)) {
        return true;
    }
    // Location: Check always not dark location range
    if ((locationId < -399) || (locationId > -300)) {
        return false;
    }

    return true;
}

export const userCanSee = async (
    player: Player,
    locationId?: number,
    world?: World,
) => (player.level > 9)
    || !isDark(locationId || player.locationId)
    || await hasLight(locationId, world);

/*


isdark()
{
    extern long curch;
    extern long numobs;
    if((curch<=-1113)&&(curch>=-1123)) goto idk;
    if((curch<-399)||(curch>-300)) return(0);
    idk:c=0;
    while(c<numobs)
    {
        if((c!=32)&& !c.flags.isLit) {c++;continue;}
        if(ishere(c)) return(0);
        if((c.carryFlag === IS_LOCATED_AT)||(c.carryFlag === IS_CONTAINED_IN)) {c++;continue;}
        if(players[c.locationId].locationId !== user.locationId) {c++;continue;}
        return(0);
    }
    return(1);
}



modifwthr(n)
{
    extern long curch;
    switch(curch)
    {
        default:
            if((curch>=-179)&&(curch<=-199))
            {
                if(n>1)return(n%2);
                else return(n);
            }
            if((curch>=-178)&&(curch<=-100))
            {
                if((n==1)||(n==2)) n+=2;
                return(n);
            }
            return(n);
    }
}

setpflags()
{
    long a,b,c,d;
    extern long mynum;
    extern char wordbuf[];
    if(!user.player.flags.canChangeFlags)
    {
        bprintf("You can't do that\n");
        return;
    }
    if(brkword()==-1)
    {
        bprintf("Whose PFlags ?\n");
        return;
    }
    a = await world.findVisiblePlayerByName(wordbuf, user, user.isBlind);
    if(a==-1)
    {
        bprintf("Who is that ?\n");
        return;
    }
    if(brkword()==-1)
    {
        bprintf("Flag number ?\n");
        return;
    }
    b=numarg(wordbuf);
    if(brkword()==-1)
    {
        bprintf("Value is %s\n",a.flags[b]?"TRUE":"FALSE");
        return;
    }
    c=numarg(wordbuf);
    if((c<0)||(c>1)||(b<0)||(b>31))
    {
        bprintf("Out of range\n");
        return;
    }
    a.flags[b] = c;
}
*/
