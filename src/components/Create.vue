<template>
  <div>
    <h1>Seal Generator</h1>
    <div class="images">
      <img
        class="textimages"
        width="80"
        height="80"
        v-for="image in this.$store.state.editedImages"
        :src="image.img"
        @mousedown="choosetext($event, image.id)"
      />
    </div>
    <canvas
      width="200"
      height="200"
      class="seal"
      ref="seal"
      @mouseup="choose($event)"
    ></canvas>
    <button class="save" @click="save()">Save</button>
  </div>
</template>

<script>
export default {
  name: "Create",
  data() {
    return {
      canvas: null,
      clickid: -1,
      imagechosen: null
    };
  },
  methods: {
    choosetext(event, id) {
      event.preventDefault();
      this.clickid = id;

      let image = new Image();
      image.src = this.$store.state.editedImages[this.clickid].img;

      this.imagechosen = image;
    },
    choose(e) {
      e.preventDefault();
      // console.log(e)
      let ctx = this.canvas.getContext("2d");
      if (
        e.offsetX > 0.5 * this.canvas.width &&
        e.offsetY < 0.5 * this.canvas.height
      ) {
        ctx.drawImage(this.imagechosen, 100, 0, 100, 100);
      } else if (
        e.offsetX < 0.5 * this.canvas.width &&
        e.offsetY < 0.5 * this.canvas.height
      ) {
        ctx.drawImage(this.imagechosen, 0, 0, 100, 100);
      } else if (
        e.offsetX > 0.5 * this.canvas.width &&
        e.offsetY > 0.5 * this.canvas.height
      ) {
        ctx.drawImage(this.imagechosen, 100, 100, 100, 100);
      } else if (
        e.offsetX < 0.5 * this.canvas.width &&
        e.offsetY > 0.5 * this.canvas.height
      ) {
        ctx.drawImage(this.imagechosen, 0, 100, 100, 100);
      }
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(2, 198);
      ctx.lineTo(198, 198);
      ctx.lineTo(198, 2);
      ctx.lineTo(2, 2);
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(100, 0);
      ctx.lineTo(100, 200);
      ctx.stroke();
      ctx.moveTo(0, 100);
      ctx.lineTo(200, 100);
      ctx.stroke();
    },
    save() {
      const dataUrl = this.canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "mySeal.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  mounted() {
    this.canvas = this.$refs.seal;
    let ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.lineTo(2, 198);
    ctx.lineTo(198, 198);
    ctx.lineTo(198, 2);
    ctx.lineTo(2, 2);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, 200);
    ctx.stroke();
    ctx.moveTo(0, 100);
    ctx.lineTo(200, 100);
    ctx.stroke();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.images {
  height: 80%;
  width: 30%;
  left: 20%;
  top: 10%;
  position: absolute;
  border: solid #b2b2b2;
  border-radius: 8px;
  background-color: #ebebeb;
  /* display: flex; */
  flex-wrap: wrap;
  text-align: center;
}

.seal {
  position: absolute;
  left: 60%;
  top: 50%;
  transform: translateY(-50%);
}

.textimages {
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 25px;
  border: #be4429 2px solid;
  border-radius: 5px;
  transition: all 0.1s;
}
.textimages:active {
  box-shadow: 2px 2px 4px rgba(117, 0, 0, 0.534);
}
.save {
  width: 80px;
  height: 40px;
  left: 64%;
  position: absolute;
  top: 70%;
  transform: translateY(-50%);
  font-size: medium;
  background-color: #5dae55;
  border-radius: 20px;
  transition: all 0.3s;
  border: none;
  color: #ffffff;
}

.save:hover {
  background-color: #498843;
  cursor: pointer;
}
</style>
