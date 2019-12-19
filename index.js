const title = document.createElement('h1')
title.innerText = 'RayCasting101'
document.body.appendChild(title)

const start = document.createElement('button')
start.innerText = 'Immerse Yourself!'
start.onclick = gameStart
document.body.appendChild(start)

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
let xAxis = []
let winCondition = false
let stage = 0

//character constructor 
function character (x, y, r, color){
	this.r = r
	this.center = {x: x, y: y}
	this.color = color
	this.angle = (Math.PI / 180) * 270
}

const level = {
	worldArray: [], 
	unitCell: {x: (window.innerWidth - 50)/100, y: (window.innerHeight - 50)/50},

}

let player = new character(level.unitCell.x * 2 , level.unitCell.y * 2, level.unitCell.x / 2, 'white')
//draw rays func
let drawPlayer = false
let drawRays = false
function castRays (){

	ctx.save()
	if(drawPlayer){
		ctx.save()
		ctx.fillStyle = player.color
		ctx.translate(player.center.x, player.center.y)
		ctx.beginPath()
		ctx.arc(0, 0, player.r, 0, 360)
		ctx.fill()
		ctx.restore()
	}
	let FOV = 91
	let angleOffset = (FOV * Math.PI/180) / FOV
	let center = player.center
	let temp = mod(player.angle - (FOV / 2) * (Math.PI/180), Math.PI * 2)
	let slope = {rise: 0, run: 1}
	xAxis = []
	for (let index = 0; index <= FOV; index++) {	
		let x = center.x + 1 * Math.cos(temp)
		let y = center.y + 1 * Math.sin(temp)
		slope.run = center.x - x
		slope.rise = center.y - y
		let point = Ray(center, slope)
		let cellX = Math.floor(point.x / level.unitCell.x)
		let cellY = Math.floor(point.y / level.unitCell.y)
		let cell = level.worldArray[cellY][cellX]
		let sliver = {distance: Math.sqrt(Math.pow(point.y - center.y, 2) + Math.pow(point.x - center.x, 2)), coordinate: point, type: cell.type}
		xAxis.push(sliver)
		temp += angleOffset
		if(drawRays){
			ctx.beginPath()
			ctx.moveTo(center.x, center.y)
			ctx.lineTo(point.x, point.y)
			ctx.strokeStyle = 'yellow'
			ctx.lineWidth = 2
			ctx.stroke()
		}
	}
	ctx.restore()
}


function drawFirstPerson() {
	let maxHeight = window.innerHeight - 50
	let maxDistance = window.innerWidth - 50
	ctx.save()
	ctx.fillStyle = 'lightgray'
	ctx.fillRect(0, 0, maxDistance, maxHeight / 2)
	ctx.fillStyle = 'darkred'
	ctx.fillRect(0, maxHeight / 2, maxDistance, maxHeight)
	ctx.restore()

	for (let index = 0; index < xAxis.length; index++) {
		const sliver = xAxis[index]
		let drawHeight = (maxDistance / sliver.distance) * 10 
		ctx.save()
		ctx.fillStyle = assignColor(sliver,drawHeight,maxHeight)
		ctx.fillRect((maxDistance / 90) * index, (maxHeight / 2)- (drawHeight / 2), 20, drawHeight)
		ctx.restore()
	}
}
let array2 = [
	[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
	[2,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[2,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[2,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,2],
	[2,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,1,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,1,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,2,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,2],
	[2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,2],
	[2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,2],
	[2,0,0,0,1,0,0,1,1,2,1,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,0,0,1,1,1,1,1,1,0,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,2,0,0,1,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,6,6,6,0,0,1,1,0,0,2],
	[2,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,6,6,6,0,0,1,1,0,0,2],
	[2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,6,6,6,0,0,1,1,0,0,2],
	[2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,2],
	[2,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,3,3,3,3,4,4,4,4,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,2],
	[2,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,3,3,3,3,4,4,4,4,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,2],
	[2,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,4,4,4,4,0,0,0,0,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,0,1,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2],
	[2,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2],
	[2,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,2],
	[2,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,2],
	[2,0,0,0,1,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,0,3,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,2],
	[2,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,2],
	[2,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,2],
	[2,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,4,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,1,2],
	[2,0,0,0,5,5,5,5,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,2],
	[2,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,2],
	[2,0,0,0,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,3,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,0,0,1,1,1,1,1,2],
	[2,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,6,6,6,6,5,5,5,5,5,5,4,4,4,4,4,4,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,1,0,0,0,2],
	[2,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,4,0,0,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2],
	[2,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,2],
	[2,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,6,0,0,0,6,6,6,5,5,5,5,5,5,4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,2],
	[2,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,6,0,0,0,6,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,0,0,0,2],
	[2,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,7,0,0,0,7,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,0,0,5,1,1,1,1,1,0,0,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,2],
	[2,0,0,0,6,6,6,6,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,7,0,0,0,7,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[2,0,0,0,6,6,6,6,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,7,7,7,7,7,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[2,0,0,0,6,6,6,6,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,2],
	[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
	[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
]
let array1 = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,0,0,0,0,0,0,6,6,6,6,7,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,0,0,0,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,5,5,5,0,0,0,5,5,5,0,0,0,6,6,6,0,0,0,6,6,6,0,0,0,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,2,2,2,0,0,0,2,2,2,0,0,0,3,3,3,0,0,0,3,3,3,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,0,0,0,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
]

let stages = [array1, array2]


function gameStart() {
	title.remove()
	start.remove()
	document.body.appendChild(canvas)
	canvas.width = window.innerWidth - 10
	canvas.height = window.innerHeight - 20
	ctx.translate(15, 15)
	ctx.save()
	if (stage > stages.length - 1) {
		return
	}
	player.center = {x: level.unitCell.x * 2, y: level.unitCell.y * 2}
	player.angle = (Math.PI / 180) * 270
	winCondition = false
	let levelChoice = stages[stage]
	// Array to create the World!!

	level.worldArray = []
	for(let y = 0; y < levelChoice.length; y++){
		let row = []
		for (let x = 0; x < levelChoice[0].length; x++) {
			let cell = { //reference to the cell being rendered
				type: levelChoice[y][x],//wall
				topLeft: { 
					x: x*level.unitCell.x, 
					y: y*level.unitCell.y
				}, 
				topRight: {
					x: (x*level.unitCell.x) + level.unitCell.x,
					y: y*level.unitCell.y
				}, 
				bottomLeft: {
					x: x*level.unitCell.x,
					y: (y*level.unitCell.y) + level.unitCell.y
				}, 
				bottomRight: {
					x: (x*level.unitCell.x) + level.unitCell.x,
					y: (y*level.unitCell.y) + level.unitCell.y
				},
			}
			row.push(cell)
		}
		level.worldArray.push(row)
	}
	drawTopDown()
}
function assignColor(cell,drawHeight = 1, maxHeight = 1) {
	if (cell.type === 1) {
		return `rgb(0,0,${(255 * drawHeight) / maxHeight})` //blue
	}
	else if (cell.type === 2) {
		return `rgb(${(255 * drawHeight) / maxHeight},${(255 * drawHeight) / maxHeight},0)` //yellow
	}
	else if (cell.type === 3) {
		return `rgb(0,${(255 * drawHeight) / maxHeight},0)` // green
	}
	else if (cell.type === 4) {
		return `rgb(${(255 * drawHeight) / maxHeight},165,0)` //cyan
	}
	else if (cell.type === 5) {
		return `rgb(${(255 * drawHeight) / maxHeight},${(255 * drawHeight) / maxHeight},${(255 * drawHeight) / maxHeight})`//white to gray
	}
	else if (cell.type === 6) {
		return `rgb(${(255 * drawHeight) / maxHeight},0,${(255 * drawHeight) / maxHeight})`//purple
	}
	else if (cell.type === 7) {
		return 'rgba(0,0,0,.5)' // black with opacity half for victory
	}
}

function drawLevel() {	
	ctx.strokeStyle = 'cyan'
	ctx.fillStyle = 'darkred'
	//draw
	level.worldArray.forEach((row) => {
		row.forEach((cell) => {
			ctx.save()
			ctx.fillStyle = assignColor(cell)
			ctx.fillRect(cell.topLeft.x, cell.topLeft.y, level.unitCell.x , level.unitCell.y )
			ctx.strokeRect(cell.topLeft.x , cell.topLeft.y , level.unitCell.x , level.unitCell.y )
			ctx.restore()
		})
	})
}

function drawTopDown() {
	drawPlayer = true
	drawRays = true
	castRays()
	drawLevel()
}
//arrow keys make movement
document.addEventListener('keydown', makeMove)
document.addEventListener('keyup', resetValue)

//keyCodes
//left 37
//up 38
//right 39
//down 40
//w	87
//a	65
//s	83
//d	68
//q 81
//e 69
function collision(x, y, vx, vy, center) {
	let cellY
	let cellX
	let cell
	let tLCheck 
	let tRCheck 
	let bLCheck 
	let bRCheck 


	cellY = Math.floor((center.y + (vy * (speed + player.r)))/level.unitCell.y)
	cellX = Math.floor((center.x + (vx * (speed + player.r)))/level.unitCell.x)
	cell = level.worldArray[cellY][cellX]
	if(cell.type === 0) {
		tLCheck = (Math.pow(player.r, 2) >= Math.pow(cell.topLeft.x - (player.center.x + (vx * speed)), 2) + Math.pow(cell.topLeft.y - (player.center.y + (vy * speed)), 2) )
		tRCheck = (Math.pow(player.r, 2) >= Math.pow(cell.topRight.x - (player.center.x + (vx * speed)), 2) + Math.pow(cell.topRight.y - (player.center.y + (vy * speed)), 2) )
		bLCheck = (Math.pow(player.r, 2) >= Math.pow(cell.bottomLeft.x - (player.center.x + (vx * speed)), 2) + Math.pow(cell.bottomLeft.y - (player.center.y + (vy * speed)), 2) )
		bRCheck = (Math.pow(player.r, 2) >= Math.pow(cell.bottomRight.x - (player.center.x + (vx * speed)), 2) + Math.pow(cell.bottomRight.y - (player.center.y + (vy * speed)), 2) )			
		if(tLCheck){
			if(level.worldArray[cellY -1][cellX].type === 1
			|| level.worldArray[cellY][cellX - 1].type === 1
			|| level.worldArray[cellY - 1][cellX - 1].type === 1
			){
				canMove = false
			}
		}
		if(tRCheck){
			if(level.worldArray[cellY - 1][cellX].type === 1
			|| level.worldArray[cellY][cellX + 1].type === 1
			|| level.worldArray[cellY - 1][cellX + 1].type === 1
			){
				canMove = false
			}
		}
		if(bLCheck){
			if(level.worldArray[cellY + 1][cellX].type === 1
			|| level.worldArray[cellY][cellX - 1].type === 1
			|| level.worldArray[cellY + 1][cellX - 1].type === 1
			){
				canMove = false
			}
		}
		if(bRCheck){
			if(level.worldArray[cellY + 1][cellX].type === 1
			|| level.worldArray[cellY][cellX + 1].type === 1
			|| level.worldArray[cellY + 1][cellX + 1].type === 1
			){
				canMove = false
			}			
		}
	}
	else if (cell.type === 7) {
		if (!winCondition) {
			winCondition = true
			stage ++
		}
	}
	else{
		canMove = false
	}

}
const speed = 7
let rotationSpeed = .025
let canMove = true
function resetValue(input) {
	switch (input.keyCode) {
	case 69: 
	case 81: 
		rotationSpeed = .025
		break
	}
	if (winCondition && stage < stages.length) {
		gameStart()
	}
}
function makeMove(input){
	let x
	let y
	let vx
	let vy
	let center = player.center
	canMove = true
	switch(input.keyCode){
	//left turn e
	case 69: 
		player.angle = +mod(player.angle + rotationSpeed, Math.PI * 2).toFixed(7)
		rotationSpeed = Math.min(rotationSpeed + .005, .1)
		break
	//right turn q
	case 81: 
		player.angle = +mod(player.angle - rotationSpeed, Math.PI * 2).toFixed(7)
		rotationSpeed = Math.min(rotationSpeed + .005, .1)
		break
	//left and A
	case 37: 
	case 65: 
		x = center.x + 1 * Math.cos(mod(player.angle - 90 * (Math.PI/180), Math.PI * 2))
		y = center.y + 1 * Math.sin(mod(player.angle - 90 * (Math.PI/180), Math.PI * 2))
		vx = center.x - x
		vy = center.y - y
		collision(x, y, vx, vy, center)
		if(canMove === true){
			player.center.x += vx * speed
			player.center.y += vy * speed
		}
		break
	//up and W
	case 38:
	case 87: 

		x = center.x + 1 * Math.cos(player.angle)
		y = center.y + 1 * Math.sin(player.angle)
		vx = center.x - x
		vy = center.y - y
		collision(x, y, vx, vy, center)
		if(canMove === true){
			player.center.x += vx * speed
			player.center.y += vy * speed
		}
		break
	//right and D
	case 39: 
	case 68: 
		x = center.x + 1 * Math.cos(mod(player.angle + 90 * (Math.PI/180), Math.PI * 2))
		y = center.y + 1 * Math.sin(mod(player.angle + 90 * (Math.PI/180), Math.PI * 2))
		vx = center.x - x
		vy = center.y - y
		collision(x, y, vx, vy, center)
		if(canMove === true){
			player.center.x += vx * speed
			player.center.y += vy * speed
		}
		break

	// //down and S
	case 40: 
	case 83: 
		x = center.x + 1 * Math.cos(mod(player.angle + 180 * (Math.PI/180), Math.PI * 2))
		y = center.y + 1 * Math.sin(mod(player.angle + 180 * (Math.PI/180), Math.PI * 2))
		vx = center.x - x
		vy = center.y - y
		collision(x, y, vx, vy, center)
		if(canMove === true){
			player.center.x += vx * speed
			player.center.y += vy * speed
		}
		break

	}
	input.preventDefault()
	ctx.clearRect(-15, -15, canvas.width, canvas.height)
	castRays()
	drawFirstPerson()
	if (stage > stages.length - 1) {
		ctx.fillStyle = 'white'
		ctx.font = 'italic 69px Snell'
		ctx.fillText('You Win!!', canvas.width/3,canvas.height/2,)
		ctx.fillText('Refresh to Play again!', canvas.width/5,canvas.height/2 + 70,)
		ctx.fillText('fin-', canvas.width - 120,canvas.height - 50,)
		return
	}
	else{		
		ctx.fillText('O', canvas.width/2,canvas.height/2)
	}
}

function Ray(temp, slope) {
	let point = {x: temp.x + slope.run, y: temp.y + slope.rise}
	let cellY = Math.floor((point.y)/level.unitCell.y) 
	let cellX = Math.floor((point.x)/level.unitCell.x)	
	let cell = level.worldArray[cellY][cellX]
	if(cell.type === 0){
		return Ray(point, slope) 
	}
	else return point
}

function mod(n, m){
	return((n % m)+ m)% m
}