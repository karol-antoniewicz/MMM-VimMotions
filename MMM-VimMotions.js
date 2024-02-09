/* MagicMirror²
 * Module: MMM-VimMotions
 * https://vim.rtorr.com/
 *
 * By Karol Antoniewicz https://karolantoniewicz.com
 * MIT Licensed.
 */
Module.register("MMM-VimMotions", {
	// Module config defaults.
	defaults: {
		updateInterval: 60000,
		fadeSpeed: 4000,
		random: true
	},
	motions: [],
    dataLoaded: false,

	// Define start sequence.
	async start() {
		Log.info(`Starting module: ${this.name}`);

		await this.getData();

		this.lastMotionIndex = -1;
		setInterval(() => this.updateDom(this.config.fadeSpeed), this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		let self = this;

		fetch('./modules/MMM-VimMotions/data.json')
			.then(response => response.json())
			.then(response => {
				self.motions = response;
				self.dataLoaded = true;
				self.updateDom(self.config.fadeSpeed);
			});
	},

	getRandomMotion() {
		let motions = this.motions

		if (motions.length === 1) {
			return 0;
		}

		const generate = () => Math.floor(Math.random() * motions.length);

		let motionIndex = generate();
		while (motionIndex === this.lastMotionIndex) {
			motionIndex = generate();
		}

		this.lastMotionIndex = motionIndex;

		return motions[motionIndex];
	},

	// Override dom generator.
	getDom () {
		const wrapper = document.createElement("div");

		if (this.dataLoaded) {
			const motion = this.getRandomMotion();
			const table = document.createElement('table');

			const headerData = ["Context", "Command", "Content"];
			const bodyCellData = [motion.context, motion.command, motion.content];

			const headerRow = document.createElement('tr');
			headerData.forEach((headerCellData) => {
				const headerCell = document.createElement('th');

				headerCell.textContent = headerCellData;
				headerCell.style.borderBottom = '1px solid gray';
				headerCell.style.padding = '4px 6px';

				headerRow.appendChild(headerCell);
				table.appendChild(headerRow);
			});

			const bodyRow = document.createElement('tr');
			bodyCellData.forEach((bodyCellData) => {
				const bodyCell = document.createElement('td');

				bodyCell.textContent = bodyCellData;
				bodyCell.style.padding = '4px 6px';

				bodyRow.appendChild(bodyCell);
				table.appendChild(bodyRow);
			});

			wrapper.appendChild(table)
        } else {
            wrapper.appendChild(document.createTextNode("Loading motions..."));
        }

		return wrapper;
	},
});


