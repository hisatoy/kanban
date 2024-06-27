"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function createJsonFile() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = { message: "Hello" };
        yield fetch('/create-json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    });
}
class TaskForm {
    constructor() {
        //form要素を取得
        this.element = document.querySelector("#task-form"); //非nullアサーション
        //input要素を取得
        this.titleInputEl = document.querySelector("#form-title");
        this.descriptionInputEl = document.querySelector("#form-description");
        // create-json-buttonを取得
        this.createJsonButton = document.querySelector("#create-json-button");
        //インスタンス生成と同時にイベントリスナが自動的に設定される
        this.bindEvents();
    }
    submitHandler(event) {
        event.preventDefault(); //ブラウザのデフォルトの動作をキャンセル
        //Taskオブジェクトの生成
        const task = this.makeNewTask();
        console.log(task);
        //TaskItemクラスのインスタンス化
        const item = new TaskItem("#task-item-template", task);
        item.mount("#todo"); //todoをidに持つul要素にマウント
        //確認用の処理
        console.log(this.titleInputEl.value);
        console.log(this.descriptionInputEl.value);
        this.clearInputs();
    }
    bindEvents() {
        this.element.addEventListener("submit", this.submitHandler.bind(this));
        this.createJsonButton.addEventListener("click", this.createJsonHandler.bind(this));
    }
    createJsonHandler(event) {
        event.preventDefault();
        createJsonFile();
    }
    clearInputs() {
        this.titleInputEl.value = "";
        this.descriptionInputEl.value = "";
    }
    makeNewTask() {
        return {
            title: this.titleInputEl.value,
            description: this.descriptionInputEl.value,
        };
    }
}
class TaskList {
    constructor(templateId, _taskStatus) {
        //ターゲットのtemplate要素を取得
        this.templateEl = document.querySelector(templateId);
        //template要素のコンテンツ（子要素）を複製。trueを渡すことで全ての階層でクローンする。
        const clone = this.templateEl.content.cloneNode(true);
        //クローンした子要素から、一つ目を取得
        this.element = clone.firstElementChild;
        //taskStatusプロパティを初期化
        this.taskStatus = _taskStatus;
        this.setup();
    }
    //クローンした要素に情報を追加
    setup() {
        //カラムに表示するタスク進捗状況を示すラベルを設定
        this.element.querySelector("h2").textContent = `${this.taskStatus}`;
        //ul要素にid属性を設定
        this.element.querySelector("ul").id = `${this.taskStatus}`;
    }
    mount(selector) {
        const targetEl = document.querySelector(selector);
        targetEl.insertAdjacentElement("beforeend", this.element);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new TaskForm();
});
//配列とインデックスアクセス型を使用したユニオン型の作成
const TASK_STATUS = ["todo", "working", "done"];
TASK_STATUS.forEach((status) => {
    const list = new TaskList("#task-list-template", status);
    list.mount("#container");
});
class TaskItem {
    constructor(templateId, _task) {
        this.templateEl = document.querySelector(templateId);
        const clone = this.templateEl.content.cloneNode(true);
        this.element = clone.firstElementChild;
        //taskプロパティを初期化
        this.task = _task;
        this.setup();
        this.bindEvents();
    }
    mount(selector) {
        const targetEl = document.querySelector(selector);
        targetEl.insertAdjacentElement("beforeend", this.element);
    }
    setup() {
        //挿入した要素の子要素のリストにidを設定
        this.element.querySelector("h2").textContent = `${this.task.title}`;
        this.element.querySelector("p").textContent = `${this.task.description}`;
    }
    //TODO clickHandlerメソッドの実装。bindEvent内でイベントリスナに登録する。
    clickHandler() {
        if (!this.element.parentElement)
            return;
        //1.自身が所属しているul要素のidを見にいく
        const currentListId = this.element.parentElement.id;
        const taskStatusIdx = TASK_STATUS.indexOf(currentListId);
        //idがTASK_STATUSに見つからない時（プログラムのバグ）
        if (taskStatusIdx === -1) {
            throw new Error(`タスクステータスが不正です`);
        }
        //idによって隣カラムのidを決定
        const nextListId = TASK_STATUS[taskStatusIdx + 1];
        if (nextListId) {
            //2.隣カラムのidにli要素を挿入
            const nextListEl = document.getElementById(nextListId);
            nextListEl.appendChild(this.element);
            return;
        }
        //もし現在のリストがdoneなら要素を削除して終了
        this.element.remove();
    }
    ;
    editHandler(event) {
        event.stopPropagation(); // イベントのバブリングを停止
        const titleEl = this.element.querySelector("h2");
        const descriptionEl = this.element.querySelector("p");
        const moveButton = this.element.querySelector(".move-button");
        // 編集用のインプットを作成
        const titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.value = this.task.title;
        const descriptionInput = document.createElement("textarea");
        descriptionInput.value = this.task.description;
        // 元の要素を置き換え
        titleEl.replaceWith(titleInput);
        descriptionEl.replaceWith(descriptionInput);
        // 保存ボタンを追加
        const saveButton = document.createElement("button");
        saveButton.textContent = "保存";
        this.element.appendChild(saveButton);
        // 移動ボタンを非表示
        moveButton.classList.add("hidden");
        // 保存ボタンのイベントリスナーを設定
        saveButton.addEventListener("click", () => {
            this.task.title = titleInput.value;
            this.task.description = descriptionInput.value;
            // 元の要素に戻す
            titleInput.replaceWith(titleEl);
            descriptionInput.replaceWith(descriptionEl);
            // テキストを更新
            titleEl.textContent = this.task.title;
            descriptionEl.textContent = this.task.description;
            // 保存ボタンを削除
            saveButton.remove();
            // 移動ボタンを再表示
            moveButton.classList.remove("hidden");
        });
    }
    bindEvents() {
        //nextボタン。taskの状態を変化させる
        const moveButton = this.element.querySelector(".move-button");
        if (moveButton) {
            moveButton.addEventListener("click", this.clickHandler.bind(this));
        }
        else {
            console.error("Move button not found");
        }
        const editButton = this.element.querySelector(".edit-button");
        if (editButton) {
            editButton.addEventListener("click", this.editHandler.bind(this));
        }
        else {
            console.error("Edit button not found");
        }
    }
}
