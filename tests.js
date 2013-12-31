describe("The view model", function() {
	var viewModel;

	beforeEach(function() {
		viewModel = new ViewModel();
		viewModel.users({
			'idNicolas': {
				id: 'idNicolas',
			name: 'Nicolas'
			},
			'idOlivier': {
				id: 'idOlivier',
			name: 'Olivier'
			},
			'idElisa': {
				id: 'idElisa',
			name: 'Elisa'
			},
		});
		viewModel.loggedInUser('idOlivier');
		viewModel.selectedList('idOlivier');
		viewModel.presents([
			{
			id: "1",
			title: "Gelatine rose",
			description: "Une matière gluante et fluo",
			to: "idElisa",
			createdBy: "idElisa",
			creationDate: new Date(),
			offeredBy: "idOlivier",
			givenDate: new Date(),
			deleted: false
			},
			{
			id: "2",
			title: "Gelatine verte",
			description: "Une matière gluante et fluo",
			to: "idOlivier",
			createdBy: "idElisa",
			creationDate: new Date(),
			offeredBy: null,
			givenDate: null,
			deleted: false
			},
			{
			id: "3",
			title: "Gelatine jaune",
			description: "Une matière gluante et fluo",
			to: "idOlivier",
			createdBy: "idOlivier",
			creationDate: new Date(),
			offeredBy: "idNicolas",
			givenDate: new Date(),
			deleted: false
			},
		]);
	});

	it("lists the users in the expected order", function() {
		expect(viewModel.lists().length).toEqual(Object.keys(viewModel.users()).length);
		expect(viewModel.lists().map(function(u){return u.id;})).toEqual(['idOlivier', 'idElisa', 'idNicolas']);
	});

	it("lists the presents created by loggedInUser", function() {
		expect(viewModel.displayedPresents().map(function(p){
			return p.id;
		})).toEqual(["3"]);
	});

	it("displays the present as offered only when relevant", function() {
		expect(viewModel.displayPresentAsOffered(viewModel.presents()[2])).toEqual(null);
		viewModel.loggedInUser("idElisa");
		expect(viewModel.displayPresentAsOffered(viewModel.presents()[2])).not.toEqual(null);
		expect(viewModel.displayPresentAsOffered(viewModel.presents()[1])).toEqual(null);
	});

	it("can add present and select it when added", function() {
		viewModel.addPresent();
		viewModel.edition.title("Gelatine grise");
		viewModel.saveEditedPresent();
		var presents = viewModel.presents();
		var last = presents[presents.length - 1];
		expect(last).not.toEqual(null);
		expect(last.to).toEqual(viewModel.selectedList());
		expect(last.createdBy).toEqual(viewModel.loggedInUser());
		expect(last.offeredBy).toEqual(null);
		expect(last.title).toEqual("Gelatine grise");
	});
	
	it("can edit an existing present", function() {
		viewModel.editPresent(viewModel.presents()[0]);
		viewModel.edition.title('edited title');
		viewModel.saveEditedPresent();
		expect(viewModel.presents()[0].title).toEqual('edited title');
	});

	it("can toggle a present being offered", function() {
		viewModel.togglePresentOffered(viewModel.presents()[1]);
		expect(viewModel.presents()[1].offeredBy).toEqual(viewModel.loggedInUser());
		viewModel.togglePresentOffered(viewModel.presents()[1]);
		expect(viewModel.presents()[1].offeredBy).toEqual(null);
	});

	xit("can delete a present", function() {
		viewModel.deletePresent(viewModel.presents()[1]);
		expect(viewModel.presents().length).toEqual(2);
	});

});
