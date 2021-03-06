import { Component, h, Prop, State, Method,Event,EventEmitter } from '@stencil/core';

@Component({
    tag: 'kup-drawer',
    styleUrl: 'kup-drawer.css',
    shadow: true,
})
export class KupDrawer {
   
      /**
     * opened is used to make our drawer appear and disappear
     */
     @Prop({ reflect: true, mutable: true })opened: boolean;

    @Prop({ reflect: true, mutable: true }) right: boolean;
    @Prop({ reflect: true, mutable: true }) permanent: boolean;
    
    @Event() ClDrawer: EventEmitter;
    @Event() OpDrawer: EventEmitter;

    select:boolean;
    
    c:string;

    
    


  //---- Methods ----
    onCloseDrawer() {
        this.opened = false;
        this.right=false;
        this.ClDrawer.emit();
    }

    @Method()
    async open() {
        this.opened = true;
        this.right=true;
        this.OpDrawer.emit();
    }

    @Method()
    async Toggle() {
       // console.log(this.opened,this.right);
      if(this.opened==true && this.right==true)
      {
          this.onCloseDrawer();

      }
      else if(this.opened==false && this.right==false)
      {
          
         this.open();
      }
    }

    componentWillLoad()
   { 
       this.opened=true;
       this.opened=false;
       if(this.right==true)
       {
            this.select=true;
            this.right=false;
            if(this.permanent==true)
            {

            }
            else{
            
                this.permanent=true;
                this.permanent=false;        
                                                   
            }
                
       }
       else{
           this.select=false;
           this.right=true;
           this.right=false;
           if(this.permanent==true)
           {

           }
           else{
               this.permanent=true;
               this.permanent=false;
           }

       }
        
    }
    
   
    
   selectclass()
   {  let c:string;
       if(this.select==true&&this.permanent==false)
       {
           c='rightpos'
       }
       else if(this.select==false&&this.permanent==false)
       {
           c='leftpos'
       }
       
       else if(this.select==true&&this.permanent==true)
       {
           c= 'permanentright'
       }
       else{
           c= 'permanentleft'
       }
       
       return c;
   }

    render() {

        let mainContent = <slot name='MainContent'/>;
        this.c= this.selectclass();
        //console.log(this.select,this.permanent,this.right,this.c);

        return [
            <div class="backdrop" onClick={() => this.onCloseDrawer()} />,
            <aside class={this.c} >
                <div class="header">
              
               <div class='title'>
                   <slot name='title'/>
               </div>

               
               <div class='subtitle'>
                   <slot name='subtitle'/>
               </div>
              
               
                </div>

                <main>{mainContent}</main>
                
                
            </aside>,
        ];
    }
}
