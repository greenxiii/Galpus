describe( "main thing", function () {
    it( "four number", function () {
    	expect(2+2).toEqual(4);
    });

    it( "Plus tree", function () {
	    var sum = returnPlusThree(3);
    	expect(sum).toEqual(6);
    });
});