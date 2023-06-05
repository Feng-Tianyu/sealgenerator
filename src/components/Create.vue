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
        ctx.drawImage(this.imagechosen, 104, 4, 92, 92);
      } else if (
        e.offsetX < 0.5 * this.canvas.width &&
        e.offsetY < 0.5 * this.canvas.height
      ) {
        ctx.drawImage(this.imagechosen, 4, 4, 92, 92);
      } else if (
        e.offsetX > 0.5 * this.canvas.width &&
        e.offsetY > 0.5 * this.canvas.height
      ) {
        ctx.drawImage(this.imagechosen, 104, 104, 92, 92);
      } else if (
        e.offsetX < 0.5 * this.canvas.width &&
        e.offsetY > 0.5 * this.canvas.height
      ) {
        ctx.drawImage(this.imagechosen, 4, 104, 92, 92);
      }
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
}

.seal {
  position: absolute;
  left: 60%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
