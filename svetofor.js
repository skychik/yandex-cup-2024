"use strict";
/** Типы */
class Traffic {
    constructor(initialSignal, trafficLightController) {
        this.wantForward = [];
        this.wantLeft = [];
        this.wantRight = [];
        this.currentSignal = initialSignal;
        trafficLightController.subscribe((currentSignal) => {
            // Регулировщик сменил сигнал
            this.currentSignal = currentSignal;
            this.checkSignal(currentSignal);
        });
    }
    checkSignal(signal) {
        switch (signal) {
            case "GREEN":
                this.wantForward.forEach((resolve) => resolve());
                this.wantForward = [];
                // this.wantLeft.forEach((resolve) => resolve());
                // this.wantLeft = [];
                // this.wantRight.forEach((resolve) => resolve());
                // this.wantRight = [];
                break;
            case "LEFT":
                this.wantLeft.forEach((resolve) => resolve());
                this.wantLeft = [];
                break;
            case "RIGHT":
                this.wantRight.forEach((resolve) => resolve());
                this.wantRight = [];
                break;
        }
    }
    // Вернуть промис, который зарезолвится, когда можно будет проехать в переданном направлении.
    async go(direction) {
        return new Promise((resolve) => {
            switch (direction) {
                case "FORWARD":
                    if (this.currentSignal === "GREEN") {
                        resolve();
                        return;
                    }
                    this.wantForward.push(resolve);
                    break;
                case "LEFT":
                    if (this.currentSignal === "LEFT") {
                        resolve();
                        return;
                    }
                    this.wantLeft.push(resolve);
                    break;
                case "RIGHT":
                    if (this.currentSignal === "RIGHT") {
                        resolve();
                        return;
                    }
                    this.wantRight.push(resolve);
                    break;
            }
        });
    }
}
// exports.Traffic = Traffic;
