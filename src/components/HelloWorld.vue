<template>
  <div>
    <h1>Image Generator</h1>
    <!-- <div class="sucai">
        <img src="./1.png" id="candidate1" class="candidates" onclick="choosecontent('./1.png')" width="100" height="100">
    </div> -->
    <div class="uploadbox">
      <div class="upload1">
        <input
          type="file"
          id="contentImage"
          ref="contentImage"
          accept="image/png, image/jpeg"
          @change="previewImage($event, 1)"
        />
        <label for="contentImage">Content Image</label>
        <span
          class="file-name"
          id="contentFileName"
          ref="contentFileName"
        ></span>
      </div>
      <img
        id="contentPreview"
        ref="contentPreview"
        src="../../static/upload.png"
        width="100"
        height="100"
      />
      <div class="upload2">
        <input
          type="file"
          id="styleImage"
          ref="styleImage"
          accept="image/png, image/jpeg"
          @change="previewImage($event, 2)"
        />
        <label for="styleImage">Style Image</label>
        <span class="file-name" id="styleFileName" ref="styleFileName"></span>
      </div>
      <img
        id="stylePreview"
        ref="stylePreview"
        src="../../static/upload.png"
        width="100"
        height="100"
      />
      <div class="button-container">
        <button class="generate-button" @click="generateImage()">
          Generate
        </button>
      </div>
      <img
        id="generatedImage"
        ref="generatedImage"
        src="../../static/upload.png"
        width="100"
        height="100"
      />
      <button @click="createCanvas" class="editbutton">Edit</button>
      <button @click="collectThis" class="collect">Collect</button>
    </div>
    <Transition name="bounce">
      <div class="editimg" v-if="edit">
      <canvas ref="canvas" width="150" height="150" class="canvas"></canvas>
      <button class="black" @click="editcolor = 'black'">black</button>
      <button class="white" @click="editcolor = 'white'">white</button>
      <button class="finish" @click="finishedit">finish</button>
    </div>
    </Transition>
    <button class="gotocreate" @click="gotocreate()">Make Seal</button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      contentImage: null,
      styleImage: null,
      contentpre: null,
      stylepre: null,
      edit: false,
      editcolor: "black",
      editedimg: null
    };
  },
  methods: {
    generateImage() {
      const formData = new FormData();
      formData.append("content_img", this.contentImage);
      formData.append("style_img", this.styleImage);

      fetch("http://127.0.0.1:5000/getimage", {
        method: "POST",
        body: formData
      })
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          this.$refs.generatedImage.src = url;

          const image = new Image();
          image.src = this.$refs.generatedImage.src;
          image.onload = () => {
            const canvas1 = document.createElement("canvas");
            const context = canvas1.getContext("2d");
            canvas1.width = 150;
            canvas1.height = 150;
            context.drawImage(image, 0, 0, 150, 150);
            const editedImageUrl = canvas1.toDataURL("image/png");

            this.editedimg = editedImageUrl;
          };
        })
        .catch(error => {
          console.log("Error:", error);
        });
    },

    previewImage(e, id) {
      console.log(e);
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (id === 1) {
          this.contentpre.src = reader.result;
        } else {
          this.stylepre.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    },
    createCanvas() {
      // 获取图片元素
      this.edit = true;
      this.$nextTick(function() {
        const imgElement = this.$refs.generatedImage;

        // 创建Canvas元素
        const canvas = this.$refs.canvas;
        const context = canvas.getContext("2d");

        // 设置Canvas的宽高与图片的宽高一致
        // canvas.width = imgElement.width;
        // canvas.height = imgElement.height;

        // 在Canvas上绘制图片
        context.drawImage(imgElement, 0, 0, 150, 150);
        canvas.addEventListener("mousedown", this.startDrawing);
        canvas.addEventListener("mousemove", this.draw);
        canvas.addEventListener("mouseup", this.stopDrawing);
        canvas.addEventListener("mouseleave", this.stopDrawing);
      });
    },
    finishedit() {
      const canvas = this.$refs.canvas;
      const editedImage = canvas.toDataURL("image/png");

      // 将编辑完成的图片赋值给generatedImage标签的src属性
      this.$refs.generatedImage.src = editedImage;
      this.editedimg = editedImage;
      // console.log(this.$store.state.editedImages[0].id, this.$store.state.editedImages[0].img)

      this.edit = false;
    },
    collectThis() {
      // 将编辑完成的图片保存到数组中
      this.$store.commit("addImage", this.editedimg);
      alert('保存成功')
      // this.currentid = this.currentid + 1;
      // console.log(
      //   this.$store.state.editedImages[this.currentid - 1].id,
      //   this.$store.state.editedImages[this.currentid - 1].img
      // );
    },
    gotocreate() {
      this.$router.push({ path: "/create" });
    },
    startDrawing(event) {
      this.isDrawing = true;
      const context = this.$refs.canvas.getContext("2d");
      context.beginPath();
      this.draw(event);
    },

    draw(event) {
      if (!this.isDrawing) return;

      const context = this.$refs.canvas.getContext("2d");

      // 根据鼠标位置绘制路径
      context.lineWidth = 1;
      context.lineCap = "round";
      context.strokeStyle = this.editcolor; // 设置颜色为黑色

      context.lineTo(event.offsetX, event.offsetY);
      context.stroke();
    },

    stopDrawing() {
      this.isDrawing = false;
    }
  },
  mounted() {
    this.contentpre = this.$refs.contentPreview;
    this.stylepre = this.$refs.stylePreview;

    const contentImageInput = this.$refs.contentImage;
    const contentFileName = this.$refs.contentFileName;
    contentImageInput.addEventListener("change", () => {
      const fileName = contentImageInput.files[0].name;
      contentFileName.textContent = fileName;

      this.contentImage = this.$refs.contentImage.files[0];
    });

    const styleImageInput = this.$refs.styleImage;
    const styleFileName = this.$refs.styleFileName;
    styleImageInput.addEventListener("change", () => {
      const fileName = styleImageInput.files[0].name;
      styleFileName.textContent = fileName;

      this.styleImage = this.$refs.styleImage.files[0];
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}

h1 {
  text-align: center;
}

.upload1 {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}
.upload1 input[type="file"] {
  display: none;
}

.upload1 label {
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.upload1 .file-name {
  margin-left: 10px;
}

.upload2 {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.upload2 input[type="file"] {
  display: none;
}

.upload2 label {
  padding: 10px 20px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.upload2 .file-name {
  margin-left: 10px;
}

#contentPreview {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
}

#stylePreview {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
}

img[src=""],
img:not([src]) {
  opacity: 0.5;
  border: solid 1px #000000;
}

#generatedImage {
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translateX(-50%);
}

.button-container {
  position: absolute;
  left: 50%;
  top: 65%;
  transform: translateX(-50%);
}

.generate-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.generate-button:hover {
  background-color: #45a049;
}

.uploadbox {
  position: absolute;
  width: 30%;
  height: 70%;
  top: 10%;
  left: 35%;
  border-radius: 8px;
  border: 1px solid #aeaeae;
  background-color: #eeeeee;
}

.sucai {
  position: absolute;
  width: 30%;
  height: 80%;
  top: 10%;
  left: 18%;
  border-radius: 8px;
  border: 1px solid #aeaeae;
  background-color: #eeeeee;
}

.candidates {
  margin: 10px 10px 10px 10px;
  cursor: pointer;
}

.editimg {
  position: absolute;
  border: solid 2px #aeaeae;
  border-radius: 8px;
  height: 30vh;
  width: 30vh;
  top: 35%;
  left: calc(50% - 15vh);
  /* transform: translate(-50%, -50%); */
  background-color: #f5f5f5;
  box-shadow: 2px 2px -2px -2px #3f3b3b44;
}

.editbutton {
  border-width: 0;
  background: transparent;
  outline: none;
  color: #38853c;
  position: absolute;
  bottom: 2%;
  left: 40%;
  transform: translateX(-50%);
  transition: all 0.3s;
}

.editbutton:hover {
  color: #4caf50;
  cursor: pointer;
}
.collect {
  border-width: 0;
  background: transparent;
  outline: none;
  color: #38853c;
  position: absolute;
  bottom: 2%;
  left: 60%;
  transform: translateX(-50%);
  transition: all 0.3s;
}

.collect:hover {
  color: #4caf50;
  cursor: pointer;
}
.gotocreate {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

.black{
  border-radius: 2px;
  background-color: #8d8d8d;
  color: #ffffff;
  margin-top: 10px;
  border: none;
  transition: all 0.3s;
}
.black:hover{
cursor: pointer;
background-color: #4d4d4d;
}
.white{
  border-radius: 2px;
  background-color: #8d8d8d;
  color: #ffffff;
  margin-top: 10px;
  border: none;
  transition: all 0.3s;
}
.white:hover{
cursor: pointer;
background-color: #d7d7d7;
color: #000000;
}
.finish{
  border-radius: 2px;
  background-color: #8d8d8d;
  color: #ffffff;
  margin-top: 10px;
  border: none;
  transition: all 0.3s;
}
.finish:hover{
cursor: pointer;
background-color:#367d39;
}
</style>
