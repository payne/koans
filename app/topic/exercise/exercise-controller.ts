module ExerciseCtrl {
  "use strict";
  import IExercise = core.IExercise;

  class ExerciseCtrl {
    currentExercise:IExercise;
    content:string;
    hidden:string;

    errors:Array<core.IError> = [];
    successMessage:string = "Great job!!!";
    success = false;
    id:number;
    exerciseCount:number;
    solutionClicked:boolean;

    libsLoader = () => this.libs;

    onError = (errors:Array<core.IError>) => {
      this.success = false;
      this.errors = errors;
      this.$timeout(() => {
        this.$scope.$digest();
      });
    };
    onSuccess = () => {
      if (!this.getCurrentExercise().solved && !this.getCurrentExercise().solutionRequested) {
        this.getCurrentExercise().solved = true;
        this.nextExercise();
        this.success = true;

        if (this.allExercisesSolved()) {
          this.showSolveMoreToast("Congratulations! You solved all exercises.");
        } else if (this.finished()) {
          this.showSolveMoreToast("You finished all exercises.");
        } else {
          (<Toastr>toastr).success("Great job!");
        }

        this.$timeout(() => {
          this.$scope.$apply();
        });
      }
    };

    private showSolveMoreToast = (message:string) => {
      let popup = "<div>" +
        "<p class='t-paragraph'>" + message + "</p>" +
        "<p class='t-paragraph'>Solve more exercises?</p>" +
        "<a href='#/topic-list' class='button button--light'>Ok</a>" +
        "<button class='button button--light'>Cancel</button>" +
        "</div>";
      (<Toastr>toastr).success(popup, "", {timeOut: 0});
    };

    finished = () => this.topicData.items.every((exercise) => exercise.solved || exercise.solutionRequested);

    allExercisesSolved = () => this.topicData.items.every((exercise) => exercise.solved && !exercise.solutionRequested);

    getExerciseId = () => this.id + 1;

    nextExercise = () => {
      if (this.hasNextExercise()) {
        this.goToExercise(this.getExerciseId() + 1);
      }
    };

    previousExercise = () => {
      if (this.hasPreviousExercise()) {
        this.goToExercise(this.getExerciseId() - 1);
      }
    };

    hasNextExercise = ():boolean => this.getExerciseId() < this.exerciseCount;

    hasPreviousExercise = ():boolean => this.getExerciseId() > 1;

    private goToExercise = (id:number) => {
      this.$state.go("main.topic.exercise.details", {exerciseId: id});
    };

    public static $inject = ["topicData", "$state", "$scope", "libs", "$timeout", "EditMarker"];

    constructor(private topicData:core.ITopic,
                private $state:angular.ui.IStateService,
                private $scope:ng.IScope,
                private libs,
                private $timeout:ng.ITimeoutService,
                private editMarker:codeEditor.EditMarker) {
      this.id = this.$state.params["exerciseId"] - 1;
      this.currentExercise = this.getCurrentExercise();
      this.exerciseCount = topicData.items.length;

      let hidable = this.editMarker.splitVisible(this.currentExercise.exercise);
      this.hidden = hidable.hidden;
      this.content = hidable.visible;

      if (!this.currentExercise.userSolution) {
        this.currentExercise.userSolution = hidable.visible;
      }
    }

    giveUp = () => {
      this.solutionClicked = !this.solutionClicked;
      if (this.solutionClicked) {
        if (!this.getCurrentExercise().solved) {
          this.getCurrentExercise().solutionRequested = true;
        }
        this.$state.go("main.topic.exercise.solution");
        if (this.finished()) {
          this.showSolveMoreToast("You finished all exercises.");
        }

      } else {
        this.$state.go("main.topic.exercise.details");
      }
    };

    private getCurrentExercise = () => this.topicData.items[this.id];

    public isSolution = () => {
      return this.$state.is("main.topic.exercise.solution");
    };
  }

  /**
   * @ngdoc object
   * @name exercise.controller:ExerciseCtrl
   *
   * @description
   *
   */
  angular
    .module("exercise")
    .controller("ExerciseCtrl", ExerciseCtrl);
}