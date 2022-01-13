/*
frobnicate()
{
	extern char wordbuf[];
	extern long my_lev;
	int x;
	char ary[128];
	char bf1[8],bf2[8],bf3[8];
	if(my_lev<10000)
	{
		bprintf("No way buster.\n");
		return;
	}
	if(brkword()==-1)
	{
		bprintf("Frobnicate who ?\n");
		return;
	}
	x = await world.findVisiblePlayerByName(wordbuf, user, user.isBlind);
	if((x>15)&&(my_lev!=10033))
	{
		bprintf("Can't frob mobiles old bean.\n");
		return;
	}
	if((x.isSuperuser())&&(my_lev!=10033))
	{
		bprintf("You can't frobnicate %s!!!!\n",pname(x));
		return;
	}
	bprintf("New Level: ");
	await g.world.save();
    const messages = await getMessages(bprintf.dirty, bprintf.unfinished);
	result.keyboard = false;
	bf1 = await getFromKeyboard(6);

	bprintf("New Score: ");
    await g.world.save();
    const messages = await getMessages(bprintf.dirty, bprintf.unfinished);
	bf2 = await getFromKeyboard(8);

	bprintf("New Strength: ");
    await g.world.save();
    const messages = await getMessages(bprintf.dirty, bprintf.unfinished);
	bf3 = await getFromKeyboard(8);

	result.keyboard = true;

	sprintf(ary,"%s.%s.%s.",bf1,bf2,bf3);

    world = await World.load();
	sendsys(pname(x),pname(x),-599,0,ary);
	bprintf("Ok....\n");
}


 */