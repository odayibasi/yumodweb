 QUnit.module("fModel");


 /*================================================================
 * FOLDER
 =================================================================*/

 QUnit.test("addFolder", function(assert) {
     var fModel = fModelFactory.newModel();
     var folder = fModel.addFolder("AWS");
     assert.ok(fModel.folders.length == 1, "One Folder Added");
     assert.ok(folder.name == "AWS", "Folder Name Sets");
     assert.ok(folder.uuid != undefined, "Folder UUID Sets");
     folder = fModel.addFolder("Android");
     assert.ok(fModel.folders.length == 2, "Second Folder Added");
     folder = fModel.addFolder();
     assert.ok(folder.name == null, "Folder Name Null If Params Not Gives");
 });

 QUnit.test("getFolder", function(assert) {
     var fModel = fModelFactory.newModel();
     assert.ok(fModel.folders.length == 0, "No Folder Added Yet");
     var folder = fModel.getFolder();
     assert.ok(folder == null, "uuid params not passed then folder null");
     var folder = fModel.getFolder("a1234")
     assert.ok(folder == null, "undefined uuid params passed then folder null");
     folder = fModel.addFolder("AWS");
     assert.ok(folder.uuid == fModel.getFolder(folder.uuid).uuid, "uuid check okay");
     assert.ok(folder.name == fModel.getFolder(folder.uuid).name, "name check okay");
 });



 QUnit.test("getFolderIndex", function(assert) {
     var fModel = fModelFactory.newModel();
     assert.ok(fModel.getFolderIndex() == null, "No params passing result is Null");
     assert.ok(fModel.getFolderIndex("av1") == null, "Invalid params passing result is Null");
     fModel.addFolder("AWS");
     fModel.addFolder("Android");
     var fIOS = fModel.addFolder("IOS");
     assert.ok(fModel.getFolderIndex(fIOS.uuid) == 2, "IOS is 2 Index");
 });



 QUnit.test("listFolder", function(assert) {
     var fModel = fModelFactory.newModel();
     assert.ok(fModel.listFolder() != null, "Initial Folders not null");
     assert.ok(Array.isArray(fModel.listFolder()), "Initial Folders type is array");
     assert.ok(fModel.listFolder().length == 0, "Initial Folders is empty");
     fModel.addFolder("AWS");
     fModel.addFolder("Android");
     fModel.addFolder("IOS");
     assert.ok(fModel.listFolder().length == 3, "List Folders has 3 folder");
 });



 QUnit.test("updateFolder", function(assert) {
     var fModel = fModelFactory.newModel();
     var folder = fModel.addFolder("AWS");
     fModel.updateFolder(folder.uuid);
     assert.ok(folder.name == "AWS", "Params Null Then Nothing Changed");

     var params = { xyz: "abc" };
     fModel.updateFolder(folder.uuid, params);
     assert.ok(folder.name == "AWS", "Params Not Has Prop Name");

     params = { name: "abc" };
     fModel.updateFolder(folder.uuid, params);
     assert.ok(folder.name == "abc", "Params Set Name Property abc");

 });


 QUnit.test("deleteFolder", function(assert) {

     var fModel = fModelFactory.newModel();
     var folder1 = fModel.addFolder("AWS");
     var folder2 = fModel.addFolder("Android");
     var folder3 = fModel.addFolder("IOS");
     assert.ok(fModel.listFolder().length == 3, "Added 3 folder");
     fModel.deleteFolder(folder2.uuid);
     assert.ok(fModel.listFolder().length == 2, "Removed 1 and 2 folder Back");
     assert.ok(fModel.getFolder(folder2.uuid) == null, "Folder2 Removed Succeded");

 });


 /*================================================================
 * STORY
 =================================================================*/


 QUnit.test("addStory", function(assert) {
     var fModel = fModelFactory.newModel();
     var folder = fModel.addFolder("AWS");
     fModel.addStory(folder.uuid, "ServerlessAWS2015");
     fModel.addStory(folder.uuid, "ServerlessAWS2016");
     fModel.addStory(folder.uuid, "ServerlessAWS2017");
     assert.ok(fModel.listStory(folder.uuid).length == 3, "Add 3 Story to AWS OK");

     folder = fModel.addFolder("Android");
     fModel.addStory(folder.uuid, "Android2015");
     fModel.addStory(folder.uuid, "Android2016");
     assert.ok(fModel.listStory(folder.uuid).length == 2, "Add 2 Story Android OK");
 });



 QUnit.test("getStoryIndex", function(assert) {
     var fModel = fModelFactory.newModel();
     var folder = fModel.addFolder("AWS");
     var folder2 = fModel.addFolder("Android");
     fModel.addStory(folder.uuid, "ServerlessAWS2015");
     var story2 = fModel.addStory(folder.uuid, "ServerlessAWS2016");
     fModel.addStory(folder.uuid, "ServerlessAWS2017");
     assert.ok(fModel.listStory(folder.uuid).length == 3, "Add 3 Story to Serverless AWS OK");
     storyIndex = fModel.getStoryIndex(folder.uuid, story2.uuid);
     assert.ok(storyIndex === 1, "Get StoryIndex OK");
 });


 QUnit.test("listStory", function(assert) {
     var fModel = fModelFactory.newModel();
     var folder = fModel.addFolder("AWS");
     fModel.addStory(folder.uuid, "ServerlessAWS2015");
     fModel.addStory(folder.uuid, "ServerlessAWS2016");
     fModel.addStory(folder.uuid, "ServerlessAWS2017");
     assert.ok(fModel.listStory(folder.uuid).length == 3, "Add 3 Story to AWS OK And List Story Tested");

     folder = fModel.addFolder("Android");
     fModel.addStory(folder.uuid, "Android2015");
     fModel.addStory(folder.uuid, "Android2016");
     assert.ok(fModel.listStory(folder.uuid).length == 2, "Add 2 Story Android OK List Story Tested");
 });

 QUnit.test("updateStory", function(assert) {
     var fModel = fModelFactory.newModel();
     var folder = fModel.addFolder("AWS");
     fModel.addStory(folder.uuid, "ServerlessAWS2015");
     story = fModel.addStory(folder.uuid, "ServerlessAWS2016");

     fModel.updateStory(story.uuid)
     var xStory = fModel.getStory(story.uuid);
     assert.ok(xStory.name == "ServerlessAWS2016", "Params Null Then Nothing Changed");

     var params = { xyz: "abc" };
     fModel.updateStory(story.uuid, params);
     xStory = fModel.getStory(story.uuid);
     assert.ok(xStory.name == "ServerlessAWS2016", "Params Not Has Prop Name");

     params = { name: "abc" };
     fModel.updateStory(story.uuid, params);
     xStory = fModel.getStory(story.uuid);
     assert.ok(xStory.name == "abc", "Params Set Name Property abc");

 });



 QUnit.test("deleteStory", function(assert) {

     var fModel = fModelFactory.newModel();
     var folder = fModel.addFolder("AWS");
     fModel.addStory(folder.uuid, "ServerlessAWS2015");
     fModel.addStory(folder.uuid, "ServerlessAWS2016");
     var story2 = fModel.addStory(folder.uuid, "ServerlessAWS2017");
     assert.ok(fModel.listStory(folder.uuid).length == 3, "Add 3 Story to AWS OK And List Story Tested");

     fModel.deleteStory(story2.uuid);
     assert.ok(fModel.listStory(folder.uuid).length == 2, "Removed 1 and 2 storys Back");
     assert.ok(fModel.getStory(story2.uuid) == null, "Formula Removed Succeded");

 });




