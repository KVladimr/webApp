<template>
  <div>
    <v-layout v-if="!showNote">
      <v-btn
        class="add-note-button"
        color="indigo darken-2"
        dark
        small
        @click="addNote" >
        Добавить заметку
      </v-btn>
      <v-spacer></v-spacer>
    </v-layout>
    <div class="note" v-else>
      <v-layout>
        <h4 class="note-caption">Ваша заметка:</h4>
        <v-spacer></v-spacer>
        <v-btn
          v-show="!isTestareaEditable"
          class="note-buttons"
          flat
          small
          @click="isTestareaEditable = true">
          <v-icon small color="grey">edit</v-icon>
        </v-btn>
        <v-btn
          v-show="!isTestareaEditable"
          class="note-buttons"
          flat
          small       
          @click="deleteNote">
          <v-icon small color="grey">delete_forever</v-icon>
        </v-btn>
      </v-layout>
      <div>
        <textarea
          class="note-textarea"
          maxlength="300"
          v-model="tempNotetext"
          :readonly="!isTestareaEditable"
        ></textarea>
        <v-layout wrap v-if="isTestareaEditable">
          <v-spacer></v-spacer>
          <v-btn
            color="indigo darken-2"
            dark
            small
            @click="save">
            Сохранить
          </v-btn>
          <v-btn
            color="indigo darken-2"
            dark
            small
            @click="cancel">
            Отмена
          </v-btn>
        </v-layout>
        <br>
        <div class="danger-alert" v-html="error" />
      </div>
    </div>
  </div>
</template>

<script>
import NotesService from '@/services/NotesService'

export default {
  data () {
    return {
      error: null,
      showNote: false,
      tempNotetext: '',
      isTestareaEditable: false
    }
  },
  props: {
    note: Object
  },
  watch: {
    note: function () {
      this.showNote = !!(this.note.notetext.trim())
      this.tempNotetext = this.note.notetext
    }
  },
  methods: {
    async save () {
      try {
        const targetId = this.$route.params.id
        const response = (await NotesService.post({
          targetId: targetId,
          content: this.tempNotetext
        })).data
        this.note = response
        this.cancel()
      } catch (error) {
        console.log('error: ' + error)
      }
      // проверить на сохранение пустых строк
      // отправить текст заметки на сервер, создать или обновить запись в базе, очистить временную строку
    },
    async deleteNote () {
      try {
        const targetId = this.$route.params.id
        const response = (await NotesService.delete(targetId)).data
        this.note = {notetext: ''}
        // куда выводить сообщение об удалении?
        this.isTestareaEditable = false
        console.log('message: ' + response.message)
      } catch (error) {
        console.log('error: ' + error)
      }
    },
    cancel () {
      this.tempNotetext = this.note.notetext
      this.showNote = !!(this.note.notetext.trim())
      this.isTestareaEditable = false
    },
    addNote () {
      this.showNote = true
      this.isTestareaEditable = true
      this.tempNotetext = this.note.notetext
    }
  }
}
</script>

<style scoped>
.note {
  width: 100%;
  padding: 5px;
  height: auto;
  border: 1px solid black;
  margin-top: 10px;
  border-radius: 5px;
  background-color: #eee;
  text-align: left;
}
.note-caption {
  text-align: left;
  padding: 3px;
}
.note-textarea {
  resize: none;
  width: 100%;
}
.note-buttons {
  min-width: 0;
  margin: 0;
}
.add-note-button {
  width: 170px;
  margin-left: 15px;
}
</style>
