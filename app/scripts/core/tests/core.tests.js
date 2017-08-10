describe('Core:', function () {

  var CoreService,
      FilesService,
      ParticipantsService,
      ProjectsService,
      AnnotationsService,
      httpBackend;

  // Initialization of the AngularJS application before each test case
  beforeEach(module('ngApp.files',
                    'ngApp.participants',
                    'ngApp.projects',
                    'ngApp.annotations',
                    'core.services'));

  beforeEach(module(function ($provide) {
      $provide.value('notify', { closeAll: function() {} });
      $provide.value('config', {});
      $provide.value('ngProgressLite', {});
      $provide.value('AuthRestangular', {});
      $provide.value('RestFullResponse', {});
  }));

  beforeEach(inject(function ($httpBackend) {
    httpBackend = $httpBackend;
  }));

  describe('Service:', function () {

    describe('should retry API calls once:', function () {
      it('on Files:', inject(function (CoreService, FilesService) {
        sinon.spy(FilesService.ds, 'get');
        sinon.spy(CoreService, 'retry');

        httpBackend.whenGET("/files?filters=%7B%7D&from=0&size=20&sort=cases.project.project_id:asc").respond(500, '');

        FilesService.getFiles();
        httpBackend.flush();

        expect(FilesService.ds.get).to.have.been.calledOnce;
        expect(CoreService.retry).to.have.been.calledOnce;
      }));

      it('on Participants:', inject(function (CoreService, ParticipantsService) {
        sinon.spy(ParticipantsService.ds, 'get');
        sinon.spy(CoreService, 'retry');

        httpBackend.whenGET("/cases?filters=%7B%7D&from=1&size=20&sort=case_id:asc").respond(500, '');

        ParticipantsService.getParticipants();
        httpBackend.flush();

        expect(ParticipantsService.ds.get).to.have.been.calledOnce;
        expect(CoreService.retry).to.have.been.calledOnce;
      }));

    it('on Annotations:', inject(function (CoreService, AnnotationsService) {
        sinon.spy(AnnotationsService.ds, 'get');
        sinon.spy(CoreService, 'retry');

        httpBackend.whenGET("/annotations?filters=%7B%7D&from=0&size=20&sort=entity_type:asc").respond(500, '');

        AnnotationsService.getAnnotations();
        httpBackend.flush();

        expect(AnnotationsService.ds.get).to.have.been.calledOnce;
        expect(CoreService.retry).to.have.been.calledOnce;
      }));

    });
  });

});
