/*
 * 任务队列
 * @Author: chandre 
 * @Date: 2021-04-18 14:46:08 
 * @Last Modified by: chandre
 * @Last Modified time: 2021-04-18 15:26:50
 */

export default class WorkersQueue {

	constructor ( concurrentWorkers ) {
		this.pendingTasks = [];
	    this.concurrentWorkers = concurrentWorkers;

	    this.running = Array.apply( null , {
	    	length: concurrentWorkers.length
	    });

	}

	add (task) {
		return new Promise( (resolve, reject) => {
			const taskWrapper = {
				task , 
				promise : {
					resolve,
					reject
				}
			};
			this.pendingTasks.push( taskWrapper );
			if (this.pendingTasks.length > 1) return;
			let freeWorkers = this.running.reduce( (result , w ,i) => {
				!w && result.push(i);
				return result;
			},[]);
			if (freeWorkers.length) {
				let randomWorkerNumber = freeWorkers[Math.floor(Math.random() * freeWorkers.length)];
				this.runTaskInWorker(randomWorkerNumber);
			}
		})
	}

	runTaskInWorker (number) {
		this.running[number] = true;
    	const taskWrapper = this.pendingTasks.shift();

    	Promise.resolve(taskWrapper.task)
            .then( this.concurrentWorkers[number] )
            .then( this.resolveTask(taskWrapper) ) //resolve task
            .then( () => { this.running[number] = false })  //stop worker
            .then( () => {
                if (this.pendingTasks.length > 0) { //if more tasks in worker
                    this.runTaskInWorker.call( this , number);
                }
            })
            .catch( e => {
                this.running[number] = false;
                this.rejectTask(taskWrapper)(e);
                if (this.pendingTasks.length > 0) { //if more tasks in worker
                    this.runTaskInWorker.call(this, number);
                }
            });
	}

	rejectTask(taskWrapper) {
		return (result) => {
			taskWrapper.promise.reject(result);
			return result;
		};
	}
    
	resolveTask(taskWrapper) {
		return (result) => {
			taskWrapper.promise.resolve(result);
			return result;
		};
	}
}