import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './_guards/auth.guard';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';

// to define routes, we need to import Routes and RouterModule from @angular/router
const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children:
      [
        { path: "members", component: MemberListComponent },
        { path: "members/:username", component: MemberDetailComponent },
        // canDeactivate : to prevent unsaved changes
        // canDeactivate is a property of the route
        { path: "member/edit", component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard] },
        { path: "lists", component: ListsComponent },
        { path: "messages", component: MessagesComponent }
      ]
  },
  { path: "errors", component: TestErrorComponent },
  { path: "not-found", component: NotFoundComponent },
  { path: "server-error", component: ServerErrorComponent },
  // ** means anything that doesn't match the above routes
  { path: "**", component: NotFoundComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
